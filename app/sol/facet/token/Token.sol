// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct Inner {
    string symbol;
    uint256 totalSupply;
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowances;
}

struct Token {
    Inner inner;
}