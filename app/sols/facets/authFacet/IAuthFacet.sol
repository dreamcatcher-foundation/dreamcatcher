// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IAuthFacet {
    function auth__members(string memory roleId, uint256 i) external view returns (address);
    function auth__members(string memory roleId) external view returns (address[] memory);
    function auth__membersLength(string memory roleId) external view returns (uint256);
    function auth__hasMember(address account, string memory roleId) external view returns (bool);
    function auth__hasMember(string memory roleId) external view returns (bool);
    function auth__claimOwnership() external returns (bool);
    function auth__grant(address account, string memory roleId) external returns (bool);
    function auth__revoke(address account, string memory roleId) external returns (bool);
}