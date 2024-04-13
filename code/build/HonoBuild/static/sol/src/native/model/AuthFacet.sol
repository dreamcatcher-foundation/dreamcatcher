// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "./AuthPort.sol";

contract AuthFacet is AuthPort {
    function membersOf(string memory role) external view returns (address[] memory) {
        return _membersOf(role);
    }

    function membersOf(string memory role, uint256 memberId) external view returns (address) {
        return _membersOf(role, memberId);
    }

    function membersLengthOf(string memory role) external view returns (uint256) {
        return _membersLengthOf(role);
    }

    function isMemberOf(string memory role, address account) external view returns (bool) {
        return _isMemberOf(role, account);
    }

    function isMemberOf(string memory role) external view returns (bool) {
        return _isMemberOf(role);
    }
}