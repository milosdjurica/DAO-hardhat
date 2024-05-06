import { ethers } from "hardhat";

export const developmentChains = ["hardhat", "localhost", "ganache"];
export const ZERO_ADDRESS = ethers.ZeroAddress;

export const MIN_DELAY = 3600; // ! 1 hour - after a vote passes
export const PROPOSERS = []; // ! anyone can propose
export const EXECUTORS = []; // ! anyone can execute

export const GOVERNOR_NAME = "MyGovernor";
export const VOTING_DELAY = 7200; // ! Delay since proposal is created until voting starts.
export const VOTING_PERIOD = 50400; // ! Length of period during which people can cast their vote.
export const PROPOSAL_THRESHOLD = 0; // ! Minimum number of votes an account must have to create a proposal.
export const QUORUM_PERCENTAGE = 4; // ! Quorum required for a proposal to pass.
