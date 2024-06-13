// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface ITokenSetterFacet {
    function tokenSetterFacet__setSymbol(string memory symbol) external returns (bool);
}