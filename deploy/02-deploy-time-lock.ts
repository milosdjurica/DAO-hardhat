import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { MIN_DELAY } from "../utils/helper.config";

const deployTimeLock: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment,
) {
	const { deployer } = await hre.getNamedAccounts();
	const { deploy, log } = hre.deployments;

	const timeLock = await deploy("TimeLock", {
		from: deployer,
		args: [MIN_DELAY, [], []],
		log: true,
	});

	log(`TimeLock contract: `, timeLock.address);
	log("----------------------------------------------------");
};

export default deployTimeLock;
deployTimeLock.id = "deployTimeLock"; // id required to prevent re-execution
deployTimeLock.tags = ["timeLock", "all"];
