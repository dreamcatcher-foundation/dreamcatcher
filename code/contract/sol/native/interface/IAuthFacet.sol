// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./IFacet.sol";

interface IAuthFacet is IFacet {
    function membersOf(string memory role) external view returns (address[] memory);
    function membersLengthOf(string memory role) external view returns (uint256);
    function isMemberOf(string memory role, address account) external view returns (bool);
    function claim() external returns (bool);
}