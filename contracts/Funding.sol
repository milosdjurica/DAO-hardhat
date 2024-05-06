// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ! Uncomment this line to use console.log
// import "hardhat/console.sol";

////////////////////
// * Imports 	  //
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
////////////////////

contract Funding is Ownable {
    ////////////////////
    // * Errors 	  //
    ////////////////////

    ////////////////////
    // * Types 		  //
    ////////////////////
    struct User {
        address userAddress;
        uint256 moneyNeeded;
        uint256 moneyFunded;
    }

    ////////////////////
    // * Variables	  //
    ////////////////////
    User[] public s_users;

    ////////////////////
    // * Events 	  //
    ////////////////////
    event UserAdded(User addedUser);

    ////////////////////
    // * Modifiers 	  //
    ////////////////////

    ////////////////////
    // * Functions	  //
    ////////////////////

    ////////////////////
    // * Constructor  //
    ////////////////////
    constructor() Ownable(msg.sender) {}

    ////////////////////////////
    // * Receive & Fallback   //
    ////////////////////////////

    ////////////////////
    // * External 	  //
    ////////////////////

    ////////////////////
    // * Public 	  //
    ////////////////////
    function addNewUser(address _userAddress, uint256 _moneyNeeded) public onlyOwner {
        User memory newUser = User(_userAddress, _moneyNeeded, 0);
        s_users.push(newUser);
        emit UserAdded(newUser);
    }

    ////////////////////
    // * Internal 	  //
    ////////////////////

    ////////////////////
    // * Private 	  //
    ////////////////////

    ////////////////////
    // * View & Pure  //
    ////////////////////
}
