// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IFacet {
    function selectors() external pure returns (bytes4[] memory);
}