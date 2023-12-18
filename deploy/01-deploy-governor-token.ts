import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployGovernanceToken: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment,
) {
	const { deployer } = await hre.getNamedAccounts();
	const { deploy, log } = hre.deployments;

	const governanceToken = await deploy("GovernanceToken", {
		from: deployer,
		args: [], // ! constructor args
		log: true,
	});

	log(`GovernanceToken contract: `, governanceToken.address);
};
export default deployGovernanceToken;
deployGovernanceToken.id = "deployGovernanceToken"; // id required to prevent re-execution
deployGovernanceToken.tags = ["governanceToken", "all"];
