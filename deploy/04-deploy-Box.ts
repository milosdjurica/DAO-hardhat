import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Box, TimeLock } from "../typechain-types";

const deployBox: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment,
) {
	const { ethers, getNamedAccounts, deployments } = hre;
	const { deployer } = await getNamedAccounts();
	const { deploy, log, get } = deployments;

	const timeLock = await get("TimeLock");

	const box = await deploy("Box", {
		from: deployer,
		args: [], // ! constructor args
		log: true,
		// waitConfirmations: 1,
	});
	const boxContract = (await ethers.getContractAt(
		"Box",
		await box.address,
	)) as unknown as Box;

	boxContract.transferOwnership(timeLock.address);

	log(`Box contract: `, box.address);
	log("----------------------------------------------------");
};

export default deployBox;
deployBox.id = "deployBox"; // id required to prevent re-execution
deployBox.tags = ["Box", "all"];
