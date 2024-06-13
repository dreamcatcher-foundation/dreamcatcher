// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IRoutedFacet {
    function router() external view returns (address);
    function versions(string memory, uint256 i) external view returns (address);
    function versions(string memory) external view returns (address);
    function versionsLength(string memory) external view returns (uint256);
    function latestVersion(string memory) external view returns (address);
    function syncToRouter(string memory, address) external returns (bool);
}