import { ethers } from "hardhat";

export const developmentChains = ["hardhat", "localhost", "ganache"];

// 1 hour
export const MIN_DELAY = 3600;

export const VOTING_DELAY = 1;
export const VOTING_PERIOD = 5;
export const QUORUM_PERCENTAGE = 4;

export const ADDRESS_ZERO = ethers.ZeroAddress;
