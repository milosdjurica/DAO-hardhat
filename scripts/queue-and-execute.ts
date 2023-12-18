import * as fs from "fs";
import { ethers, network } from "hardhat";
import {
	FUNC_NAME,
	MIN_DELAY,
	NEW_STORE_VALUE,
	PROPOSAL_DESCRIPTION,
	developmentChains,
} from "../utils/helper.config";
import { GovernorContract } from "../typechain-types";
import { moveTime } from "../utils/move-time";
import { moveBlocks } from "../utils/move-blocks";

async function queAndExecute() {
	const isDevelopmentChain = developmentChains.includes(network.name);

	const args = [NEW_STORE_VALUE];
	const box = await ethers.getContract("Box");
	const encodedFunctionCall = box.interface.encodeFunctionData(FUNC_NAME, args);
	const descriptionHash = ethers.keccak256(
		ethers.toUtf8Bytes(PROPOSAL_DESCRIPTION),
	);

	const governor: GovernorContract =
		await ethers.getContract("GovernorContract");
	console.log("Queueing...");

	const queueTx = await governor.queue(
		[await box.getAddress()],
		[0],
		[encodedFunctionCall],
		descriptionHash,
	);

	await queueTx.wait(1);

	if (isDevelopmentChain) {
		moveTime(MIN_DELAY + 1);
		moveBlocks(1);
	}

	console.log("Executing....");
	const executeTx = await governor.execute(
		[await box.getAddress()],
		[0],
		[encodedFunctionCall],
		descriptionHash,
	);

	await executeTx.wait(1);

	const boxNewValue = await box.retreive();

	console.log("boxNewValue -> ", boxNewValue);
}

queAndExecute()
	.then(() => process.exit(0))
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
