import { network, ethers, getNamedAccounts, deployments } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { assert, expect } from "chai";

import { developmentChains } from "../../utils/helper.config";

const isDevelopmentChain = developmentChains.includes(network.name);

!isDevelopmentChain
	? describe.skip
	: describe("Example Unit Tests", () => {
			const { deploy, log, getDeploymentsFromAddress } = deployments;
			const CHAIN_ID = network.config.chainId;

			let accounts: HardhatEthersSigner[];
			let deployer: HardhatEthersSigner;
			let player1: HardhatEthersSigner;

			beforeEach(async () => {
				await deployments.fixture(["all"]);

				accounts = await ethers.getSigners();
				deployer = accounts[0];
				player1 = accounts[1];
			});

			describe("Constructor Tests", () => {
				it("Example test", async () => {});
			});
		});
