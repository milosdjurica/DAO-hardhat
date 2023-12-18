import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { GovernanceToken } from "../typechain-types";

const deployGovernanceToken: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment,
) {
	const { deployer } = await hre.getNamedAccounts();
	const { deploy, log } = hre.deployments;

	const governanceToken = await deploy("GovernanceToken", {
		from: deployer,
		args: [], // ! constructor args
		log: true,
		// waitConfirmations: 1,
	});

	log(`GovernanceToken contract: `, governanceToken.address);
	log("----------------------------------------------------");

	await delegate(governanceToken.address, deployer);
	log("Delegated !!!");
	log("----------------------------------------------------");
};

const delegate = async (
	governanceTokenAddress: string,
	delegatedAccount: string,
) => {
	// @ts-ignore
	const governanceToken: GovernanceToken = await ethers.getContractAt(
		"GovernanceToken",
		governanceTokenAddress,
	);

	const tx = await governanceToken.delegate(delegatedAccount);
	await tx.wait(1);

	// TODO Should be 1 ?!?!?!
	console.log(
		`Checkpoints -> ${await governanceToken.numCheckpoints(delegatedAccount)}`,
	);
};

export default deployGovernanceToken;
deployGovernanceToken.id = "deployGovernanceToken"; // id required to prevent re-execution
deployGovernanceToken.tags = ["governanceToken", "all"];
