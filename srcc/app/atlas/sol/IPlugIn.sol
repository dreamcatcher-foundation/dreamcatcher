// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IPlugIn {
    function selectors() external pure returns (bytes4[] memory);
}