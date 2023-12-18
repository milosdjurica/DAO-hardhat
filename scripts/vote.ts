import * as fs from "fs";
import { ethers, network } from "hardhat";
import { GovernorContract } from "../typechain-types";

import {
	VOTING_PERIOD,
	developmentChains,
	proposalsFilePath,
} from "../utils/helper.config";
import { moveBlocks } from "../utils/move-blocks";

const index = 0;

async function main(proposalIndex: number) {
	const isDevelopmentChain = developmentChains.includes(network.name);

	const proposals = JSON.parse(fs.readFileSync(proposalsFilePath, "utf-8"));
	const proposalId = proposals[network.config.chainId!][proposalIndex];

	console.log("proposalId in VOTE.ts", proposalId);

	// 0 -> Against, 1 -> For, 2 -> Abstain

	const governor: GovernorContract =
		await ethers.getContract("GovernorContract");
	const voteWay = 1;
	const reason = "Because I want to!";
	let state = await governor.state(proposalId);
	console.log("State before -> ", state);

	const voteTxResponse = await governor.castVoteWithReason(
		proposalId,
		voteWay,
		reason,
	);

	await voteTxResponse.wait(1);

	state = await governor.state(proposalId);
	console.log("State after -> ", state);

	if (isDevelopmentChain) {
		await moveBlocks(VOTING_PERIOD + 1);
	}

	state = await governor.state(proposalId);
	console.log("State after moving blocks -> ", state);

	state = await governor.state(proposalId);
	console.log("state => ", state);
	console.log("Voted! Ready to go!");
}

main(index)
	.then(() => process.exit(0))
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
