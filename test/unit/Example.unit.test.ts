import { network, ethers, getNamedAccounts, deployments } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { assert, expect } from "chai";

import { developmentChains } from "../../utils/helper.config";
import {
	Funding,
	MyGovernor,
	TimeLock,
	VotingToken,
} from "../../typechain-types";

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
			});
		});
