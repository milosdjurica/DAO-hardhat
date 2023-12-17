// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
	/**
	 *
	 * @param _minDelay How long you have to wait before executing
	 * @param _proposers List of addresses that can propose
	 * @param _executors List of addresses that can execute when a proposal passes
	 * 4th argument to TimeLockController (msg.sender) is admin
	 */
	constructor(
		uint _minDelay,
		address[] memory _proposers,
		address[] memory _executors
	) TimelockController(_minDelay, _proposers, _executors, msg.sender) {}
}
