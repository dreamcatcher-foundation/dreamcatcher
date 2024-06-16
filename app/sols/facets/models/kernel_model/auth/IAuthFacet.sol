// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IAuthFacet {
    function members(string memory roleId, uint256 i) external view returns (address);
    function members(string memory roleId) external view returns (address[] memory);
    function membersLength(string memory roleId) external view returns (uint256);
    function hasMember(string memory roleId, address account) external view returns (bool);
    function hasMember(string memory roleId) external view returns (bool);
    function claimOwnership() external returns (bool);
    function grant(string memory roleId, address account) external returns (bool);
    function revoke(string memory roleId, address account) external returns (bool);
}