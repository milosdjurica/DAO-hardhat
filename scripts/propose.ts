import { ethers } from "hardhat";
import {
	FUNC_NAME,
	NEW_STORE_VALUE,
	PROPOSAL_DESCRIPTION,
} from "../utils/helper.config";

export async function propose(
	functionToCall: string,
	args: any[],
	proposalDescription: string,
) {
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
}

propose(FUNC_NAME, [NEW_STORE_VALUE], PROPOSAL_DESCRIPTION)
	.then(() => process.exit(0))
	.catch((e) => {
		console.log(e);
		process.exit(1);
	});
