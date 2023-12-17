// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GovernanceToken is ERC20 {
	uint public s_maxSupply = 1000000000000000000000000;

	constructor() ERC20("GovernnaceToken", "GT") {
		_mint(msg.sender, s_maxSupply);
	}
}
