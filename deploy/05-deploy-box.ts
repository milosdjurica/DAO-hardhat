import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Box, TimeLock } from "../typechain-types";

const deployBox: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment,
) {
	const { deployer } = await hre.getNamedAccounts();
	const { deploy, log } = hre.deployments;

	const box = await deploy("Box", {
		from: deployer,
		args: [],
		log: true,
	});
	log("Deployed Box contract at address -> ", box.address);
	log("----------------------------------------------------");

	const timeLock: TimeLock = await ethers.getContract("TimeLock", deployer);
	const boxContract: Box = await ethers.getContractAt("Box", box.address);

	const transferOwnerTx = await boxContract.transferOwnership(
		await timeLock.getAddress(),
	);

	await transferOwnerTx.wait(1);
	log("FINISHED !!!!");
	log("----------------------------------------------------");
};
export default deployBox;
deployBox.id = "deployBox"; // id required to prevent re-execution
deployBox.tags = ["box", "all"];
