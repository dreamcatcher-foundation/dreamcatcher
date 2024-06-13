// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct Token {
    string _name;
    string _symbol;
    uint256 _totalSupply;
    mapping(address => uint256) _balances;
    mapping(address => mapping(address => uint256)) _allowances;
}