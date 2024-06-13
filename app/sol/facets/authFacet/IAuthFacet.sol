// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IAuthFacet {
    function members(string memory roleId, uint256 i) external view returns (address);
    function members(string memory roleId) external view returns (address[] memory);
    
}