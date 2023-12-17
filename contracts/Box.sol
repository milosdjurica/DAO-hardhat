// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

////////////////////
// * Imports 	  //
////////////////////
// Uncomment this line to use console.log
// import "hardhat/console.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Box is Ownable {
	////////////////////
	// * Variables	  //
	////////////////////
	uint private value;

	////////////////////
	// * Events 	  //
	////////////////////
	event ValueChanged(uint newValue);

	////////////////////
	// * Functions	  //
	////////////////////

	constructor() Ownable(msg.sender) {}

	function store(uint _newValue) public onlyOwner {
		value = _newValue;
		emit ValueChanged(_newValue);
	}

	function retreive() public view returns (uint) {
		return value;
	}
}
