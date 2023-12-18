import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import {
	MIN_DELAY,
	QUORUM_PERCENTAGE,
	VOTING_DELAY,
	VOTING_PERIOD,
} from "../utils/helper.config";

const deployGovernorContract: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment,
) {
	const { deployer } = await hre.getNamedAccounts();
	const { deploy, log, get } = hre.deployments;

	const governanceToken = await get("GovernanceToken");
	const timeLock = await get("TimeLock");

	log("Deploying Governor");
	const governorContract = await deploy("GovernorContract", {
		from: deployer,
		args: [
			governanceToken.address,
			timeLock.address,
			VOTING_DELAY,
			VOTING_PERIOD,
			QUORUM_PERCENTAGE,
		],
		log: true,
	});

	log(`GovernorContract contract: `, governorContract.address);
	log("----------------------------------------------------");
};

export default deployGovernorContract;
deployGovernorContract.id = "deployGovernorContract"; // id required to prevent re-execution
deployGovernorContract.tags = ["GovernorContract", "all"];
