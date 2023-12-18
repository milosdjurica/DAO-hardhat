import { ethers, network } from "hardhat";
import {
	FUNC_NAME,
	NEW_STORE_VALUE,
	PROPOSAL_DESCRIPTION,
	developmentChains,
} from "../utils/helper.config";

export async function propose(
	functionToCall: string,
	args: any[],
	proposalDescription: string,
) {
	const isDevelopmentChain = developmentChains.includes(network.name);

	const governor = await ethers.getContract("GovernorContract");
	const box = await ethers.getContract("Box");

	const encodedFunctionCall = box.interface.encodeFunctionData(
		functionToCall,
		args,
	);
	console.log("encodedFunctionCall", encodedFunctionCall);
	console.log(
		`Proposing ${functionToCall} on ${await box.getAddress()} with ${args}`,
	);
	console.log(`Proposal description -> ${proposalDescription}`);

	const proposeTx = await governor.propose(
		[await box.getAddress()],
		[0],
		[encodedFunctionCall],
		proposalDescription,
	);
	await proposeTx.wait(1);

	if (isDevelopmentChain) {
	}
}

propose(FUNC_NAME, [NEW_STORE_VALUE], PROPOSAL_DESCRIPTION)
	.then(() => process.exit(0))
	.catch((e) => {
		console.log(e);
		process.exit(1);
	});
