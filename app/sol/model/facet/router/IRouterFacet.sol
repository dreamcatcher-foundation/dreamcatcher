// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IRouterFacet {
    function versionsOf(string memory key, uint256 version) external view returns (address);
    function versionsLengthOf(string memory key) external view returns (uint256);
    function latestVersionOf(string memory key) external view returns (address);
    function commit(string memory key, address implementation) external returns (bool);
}