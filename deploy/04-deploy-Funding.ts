import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Funding, TimeLock } from "../typechain-types";

const deployFunding: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment,
) {
	const { ethers, getNamedAccounts, deployments } = hre;
	const { deployer } = await getNamedAccounts();
	const { deploy, log, get } = deployments;

	const timeLock = await get("TimeLock");

	const funding = await deploy("Funding", {
		from: deployer,
		args: [], // ! constructor args
		log: true,
		// waitConfirmations: 1,
	});
	const fundingContract = (await ethers.getContractAt(
		"Funding",
		funding.address,
	)) as unknown as Funding;

	fundingContract.transferOwnership(timeLock.address);

	log(`Funding contract: `, funding.address);
	log("----------------------------------------------------");
};

export default deployFunding;
deployFunding.id = "deployFunding"; // id required to prevent re-execution
deployFunding.tags = ["Funding", "all"];
