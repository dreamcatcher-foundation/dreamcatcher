// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IAuthPlugIn {
    function membersOf(string memory role, uint256 key) external view returns (address);
    function membersOf(string memory role) external view returns (address[] memory);
    function membersLengthOf(string memory role) external view returns (uint256);
    function hasRole(address account, string memory role) external view returns (bool);
    function hasRole(string memory role) external view returns (bool);
    function claimOwnership() external returns (bool);
    function grantRole(address account, string memory role) external returns (bool);
    function revokeRole(address account, string memory role) external returns (bool);
}