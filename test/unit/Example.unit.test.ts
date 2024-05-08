import { network, ethers, getNamedAccounts, deployments } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { assert, expect } from "chai";

import {
	MIN_DELAY,
	VOTING_DELAY,
	VOTING_PERIOD,
	developmentChains,
} from "../../utils/helper.config";
import {
	Funding,
	MyGovernor,
	TimeLock,
	VotingToken,
} from "../../typechain-types";
import { EventLog } from "ethers";

const isDevelopmentChain = developmentChains.includes(network.name);

!isDevelopmentChain
	? describe.skip
	: describe("Example Unit Tests", () => {
			const { deploy, log, getDeploymentsFromAddress } = deployments;
			const CHAIN_ID = network.config.chainId;

			let accounts: HardhatEthersSigner[];
			let deployer: HardhatEthersSigner;
			let player1: HardhatEthersSigner;

			let votingToken: VotingToken;
			let timeLock: TimeLock;
			let myGovernor: MyGovernor;
			let funding: Funding;

			beforeEach(async () => {
				await deployments.fixture(["all"]);

				accounts = await ethers.getSigners();
				deployer = accounts[0];
				player1 = accounts[1];

				votingToken = await ethers.getContract("VotingToken");
				timeLock = await ethers.getContract("TimeLock");
				myGovernor = await ethers.getContract("MyGovernor");
				funding = await ethers.getContract("Funding");
			});

			// describe("VotingToken tests", () => {
			// 	it("Example test", async () => {});
			// });
			// describe("TimeLock tests", () => {
			// 	it("Example test", async () => {});
			// });
			// describe("MyGovernor tests", () => {
			// 	it("Example test", async () => {});
			// });
			describe("Funding tests", () => {
				it("Reverts if not owner", async () => {
					await expect(funding.fund(deployer.address, 1))
						.to.be.revertedWithCustomError(
							funding,
							"OwnableUnauthorizedAccount",
						)
						.withArgs(deployer.address);
				});

				it("Funds", async () => {
					const DESCRIPTION = `Fund user ${deployer.address} with ${1}`;
					const encodedFunctionCall = funding.interface.encodeFunctionData(
						"fund",
						[deployer.address, 1],
					);
					console.log("Proposing...");
					const proposeTx = await myGovernor.propose(
						[await funding.getAddress()],
						[0],
						[encodedFunctionCall],
						DESCRIPTION,
					);
					// console.log("proposeTx", proposeTx);
					const proposeReceipt = await proposeTx.wait(1);
					// console.log("proposeReceipt", proposeReceipt);

					console.log("Move blocks to let people vote...");
					for (let i = 0; i < VOTING_DELAY + 1; i++) {
						await network.provider.request({
							method: "evm_mine",
							params: [],
						});
					}
					const proposalId = await (proposeReceipt!.logs[0] as EventLog).args
						.proposalId;
					let state = await myGovernor.state(proposalId);
					// ! 1 -> Pending...
					console.log("state", state);

					console.log("Voting....");

					// enum VoteType {
					// 	Against,
					// 	For,
					// 	Abstain
					// }
					const voteTx = await myGovernor.castVote(proposalId, 1);
					await voteTx.wait(1);
					console.log("Move blocks to cast votes...");
					for (let i = 0; i < VOTING_PERIOD + 1; i++) {
						await network.provider.request({
							method: "evm_mine",
							params: [],
						});
					}
					console.log("Voted!!!");
					// ! Fix this -> should be 4 !!!
					state = await myGovernor.state(proposalId);
					// ! 3 -> Canceled ???
					console.log("state", state);

					const descriptionHash = ethers.keccak256(
						ethers.toUtf8Bytes(DESCRIPTION),
					);

					console.log("Queueing....");
					const queueTx = await myGovernor.queue(
						// TODO maybe should be -> await funding.getAddress()
						[await funding.getAddress()],
						[0],
						[encodedFunctionCall],
						descriptionHash,
					);
					await queueTx.wait(1);
					console.log("Move blocks waiting vote to pass...");
					for (let i = 0; i < VOTING_PERIOD + 1; i++) {
						await network.provider.send("evm_increaseTime", [MIN_DELAY + 1]);
						await network.provider.request({
							method: "evm_mine",
							params: [],
						});
					}

					// ! Execute
					console.log("Executing.....");
					const executeTx = await myGovernor.execute(
						[await funding.getAddress()],
						[0],
						[encodedFunctionCall],
						descriptionHash,
					);

					await executeTx.wait(1);

					// TODO add method
					const lastWinner = await funding.s_winner();
					console.log("lastWinner", lastWinner);
				});
			});
		});
