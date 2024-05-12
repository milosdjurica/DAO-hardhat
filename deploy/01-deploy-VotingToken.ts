import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployVotingToken: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment,
) {
	const { deployer } = await hre.getNamedAccounts();
	const { deploy, log } = hre.deployments;

	const votingToken = await deploy("VotingToken", {
		from: deployer,
		args: [], // ! constructor args
		log: true,
		// waitConfirmations: 1,
	});

	log(`VotingToken contract: `, votingToken.address);
	log("----------------------------------------------------");
};

export default deployVotingToken;
deployVotingToken.id = "deployVotingToken"; // id required to prevent re-execution
deployVotingToken.tags = ["VotingToken", "all"];
