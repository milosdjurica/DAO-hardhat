import { ethers } from "hardhat";

export const developmentChains = ["hardhat", "localhost", "ganache"];

export const MIN_DELAY = 3600; // ! 1 hour - after a vote passes
export const PROPOSERS = []; // ! anyone can propose
export const EXECUTORS = []; // ! anyone can execute

export const VOTING_DELAY = 1;
export const VOTING_PERIOD = 5;
export const QUORUM_PERCENTAGE = 4;

export const ZERO_ADDRESS = ethers.ZeroAddress;
