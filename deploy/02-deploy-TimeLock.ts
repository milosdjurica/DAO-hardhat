import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { EXECUTORS, MIN_DELAY, PROPOSERS } from "../utils/helper.config";

const deployTimeLock: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment,
) {
	const { deployer } = await hre.getNamedAccounts();
	const { deploy, log } = hre.deployments;

	const timeLock = await deploy("TimeLock", {
		from: deployer,
		args: [MIN_DELAY, PROPOSERS, EXECUTORS], // ! constructor args
		log: true,
		// waitConfirmations: 1,
	});

	log(`TimeLock contract: `, timeLock.address);
	log("----------------------------------------------------");
};

export default deployTimeLock;
deployTimeLock.id = "deployTimeLock"; // id required to prevent re-execution
deployTimeLock.tags = ["TimeLock", "all"];
