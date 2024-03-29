// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "../../non-native/openzeppelin/utils/structs/EnumerableSet.sol";
import "./AuthSlot.sol";

contract AuthPort is AuthSlot {
    using EnumerableSet for EnumerableSet.AddressSet;

    event GrantRole(string role, address account);
    event RevokeRole(string role, address account);

    error MissingRole(address account, string missingRole);
    error CannotGrantRootAccessIfAlreadyGranted();

    modifier onlyMemberOf(string memory role) {
        onlyMemberOf_(role);
        _;
    }

    function _membersOf(string memory role) internal view returns (address[] memory) {
        return _auth()._members[role].values();
    }

    function _membersOf(string memory role, uint256 memberId) internal view returns (address) {
        return _auth()._members[role].at(memberId);
    }

    function _membersLengthOf(string memory role) internal view returns (uint256) {
        return _auth()._members[role].length();
    }

    function _isMemberOf(string memory role, address account) internal view returns (bool) {
        return _auth()._members[role].contains(account);
    }

    function _isMemberOf(string memory role) internal view returns (bool) {
        return _isMemberOf(role, msg.sender);
    }

    function _grantRoleTo(string memory role, address account) internal returns (bool) {
        _auth()._members[role].add(account);
        emit GrantRole(role, account);
        return true;
    }

    function _revokeRoleFrom(string memory role, address account) internal returns (bool) {
        _auth()._members[role].remove(account);
        emit RevokeRole(role, account);
        return true;
    }

    function _claim() internal returns (bool) {
        bool rootAccessRoleHasBeenGranted = _membersLengthOf("*") != 0;
        if (rootAccessRoleHasBeenGranted) {
            revert CannotGrantRootAccessIfAlreadyGranted();
        }
        _grantRoleTo(role, msg.sender);
        return true;
    }

    function onlyMemberOf_(string memory role) private view returns (bool) {
        if (!_isMemberOf(role)) {
            revert MissingRole(msg.sender, role);
        }
        return true;
    }
}