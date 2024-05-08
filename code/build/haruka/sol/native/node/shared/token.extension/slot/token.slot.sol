// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
"root-access-control.facet.sol";
struct Token {
    string _name;
    string _symbol;
    uint256 _totalSupply;
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowances;
}