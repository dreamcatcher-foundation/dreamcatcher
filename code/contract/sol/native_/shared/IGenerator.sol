// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

interface IGenerator {
    event Generation(address indexed from, address indexed at);

    function generate() external returns (address);
}