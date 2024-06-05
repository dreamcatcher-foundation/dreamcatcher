// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IFacet } from "../../../IFacet.sol";

interface IAuthFacet is IFacet {
    function membersOf(string memory role, uint256 memberId) external view returns (address);
    function membersOf(string memory role) external view returns (address[] memory);
    function membersLengthOf(string memory role) external view returns (uint256);
    function hasRole(address account, string memory role) external view returns (bool);
    function hasRole(string memory role) external view returns (bool);
    function claimOwnership() external returns (bool);
    function transferRole(address from, address to, string memory role) external returns (bool);
}