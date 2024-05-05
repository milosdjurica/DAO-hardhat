import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { TimeLock } from "../typechain-types";

const deployMyGovernor: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment,
) {
	const { ethers, getNamedAccounts, deployments } = hre;
	const { deployer } = await getNamedAccounts();
	const { deploy, log, get } = deployments;

	const votingToken = await get("VotingToken");
	const timeLock = await get("TimeLock");

	const timeLockContract: TimeLock = (await ethers.getContractAt(
		"TimeLock",
		timeLock.address,
	)) as unknown as TimeLock;

	const myGovernor = await deploy("MyGovernor", {
		from: deployer,
		args: [votingToken.address, timeLock.address], // ! constructor args
		log: true,
		// waitConfirmations: 1,
	});

	const proposerRole = await timeLockContract.PROPOSER_ROLE();
	const executorRole = await timeLockContract.EXECUTOR_ROLE();
	const adminRole = await timeLockContract.DEFAULT_ADMIN_ROLE();
	await timeLockContract.grantRole(proposerRole, myGovernor.address);
	await timeLockContract.grantRole(executorRole, ethers.ZeroAddress);
	await timeLockContract.revokeRole(adminRole, deployer);

	log(`MyGovernor contract: `, myGovernor.address);
	log("----------------------------------------------------");
};

export default deployMyGovernor;
deployMyGovernor.id = "deployMyGovernor"; // id required to prevent re-execution
deployMyGovernor.tags = ["MyGovernor", "all"];
