import { ethers, network } from "hardhat";
import {
	FUNC_NAME,
	NEW_STORE_VALUE,
	PROPOSAL_DESCRIPTION,
	VOTING_DELAY,
	developmentChains,
	proposalsFilePath,
} from "../utils/helper.config";
import { moveBlocks } from "../utils/move-blocks";
import { GovernorContract } from "../typechain-types";
import { EventLog } from "ethers";
import * as fs from "fs";

export async function propose(
	functionToCall: string,
	args: any[],
	proposalDescription: string,
) {
	const isDevelopmentChain = developmentChains.includes(network.name);

	const governor: GovernorContract =
		await ethers.getContract("GovernorContract");
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
	const proposeReceipt = await proposeTx.wait(1);

	if (isDevelopmentChain) {
		await moveBlocks(VOTING_DELAY + 1);
	}

	const proposalId = await (proposeReceipt!.logs[0] as EventLog).args
		.proposalId;

	const proposals = JSON.parse(fs.readFileSync(proposalsFilePath, "utf8"));
	proposals[network.config.chainId!.toString()].push(proposalId.toString());
	fs.writeFileSync(proposalsFilePath, JSON.stringify(proposals));
}

propose(FUNC_NAME, [NEW_STORE_VALUE], PROPOSAL_DESCRIPTION)
	.then(() => process.exit(0))
	.catch((e) => {
		console.log(e);
		process.exit(1);
	});
