import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import {
	ADDRESS_ZERO,
	QUORUM_PERCENTAGE,
	VOTING_DELAY,
	VOTING_PERIOD,
} from "../utils/helper.config";
import { ethers } from "hardhat";
import { TimeLock } from "../typechain-types";

const setupGovernanceContracts: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment,
) {
	const { deployer } = await hre.getNamedAccounts();
	const { deploy, log, get } = hre.deployments;

	// const governanceToken = await get("GovernanceToken");
	const timeLock: TimeLock = await ethers.getContract("TimeLock", deployer);
	const governor = await ethers.getContract("GovernorContract", deployer);

	log(`TimeLock contract: `, await timeLock.getAddress());
	log(`GovernorContract contract: `, await governor.getAddress());
	log("----------------------------------------------------");

	log("Setting up roles...");
	const proposerRole = await timeLock.PROPOSER_ROLE();
	const executorRole = await timeLock.EXECUTOR_ROLE();
	const adminRole = await timeLock.DEFAULT_ADMIN_ROLE();

	const proposerTx = await timeLock.grantRole(
		proposerRole,
		await governor.getAddress(),
	);
	await proposerTx.wait(1);
	const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO);
	await executorTx.wait(1);
	const revokeTx = await timeLock.revokeRole(adminRole, deployer);
	await revokeTx.wait(1);

	log("Roles are successfully set up!!!");
	log("----------------------------------------------------");
};

export default setupGovernanceContracts;
setupGovernanceContracts.id = "setupGovernanceContracts"; // id required to prevent re-execution
setupGovernanceContracts.tags = ["setupGovernanceContracts", "all"];
