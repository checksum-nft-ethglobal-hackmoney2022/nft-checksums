pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract CheckSumContract {

  mapping(string => address) public hashset;

  constructor() payable {}

  function add(string memory checksum) public {
    hashset[checksum] = msg.sender;
  }

  function verify(string memory checksum) public view returns (address) {
    return hashset[checksum];
  }

  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}
