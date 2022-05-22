pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract CheckSumContract {

  event SetAdd(address sender, string checksum);

  mapping(string => address) public hashset;

  constructor() payable {}

  function add(string memory checksum) public {
    hashset[checksum] = msg.sender;
    emit SetAdd(msg.sender, checksum);
  }

  function verify(string memory checksum) public view returns (bool) {
    return hashset[checksum] == msg.sender;
  }

  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}
