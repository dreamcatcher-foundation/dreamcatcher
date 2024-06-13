// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface ITokenConfigFacet {
    function setName(string memory name) external returns (bool);
    function setSymbol(string memory symbol) external returns (bool);
}