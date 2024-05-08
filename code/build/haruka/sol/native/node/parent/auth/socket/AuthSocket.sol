// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "../../../../../non-native/openzeppelin/utils/structs/EnumerableSet.sol";
import "../slot/AuthSlot.sol";

contract AuthSocket is AuthSlot {
    using EnumerableSet for EnumerableSet.AddressSet;

    event RoleTransfer(address indexed from, address indexed to, bytes32 indexed role);

    error RootAdminRoleHasAlreadyBeenClaimed();
    error CallerIsMissingRole(address account, string missingRole);
    error SenderIsMissingRole(address from, address to, bytes32 memory role);
    error RecipientCannotHaveMoreThanOneInstanceOfTheSameRole(address from, address to, string memory role);
    error RecipientAndSenderAreBothTheZeroAddress(address from, address to, string memory role);

    function _onlyRole(bytes32 memory role) internal view returns (bool) {
        address caller = msg.sender;
        bool doesNotHaveRole = _isMemberOf(caller, role);
        if (doesNotHaveRole) {
            revert CallerIsMissingRole(caller, role);
        }
        return true;
    }

    function _isMemberOf(address account, bytes32 memory role) internal view returns (bool) {
        return _membersOf()[role].contains(account);
    }

    function _mintRole(address account, bytes32 memory role) internal returns (bool) {
        return _transferRole(address(0), account, role);
    }

    function _burnRole(address account, bytes32 memory role) internal returns (bool) {
        return _transferRole(account, address(0), role);
    }

    function _transferRole(address from, address to, string memory role) internal returns (bool) {
        bool senderIsZeroAddress = from == address(0);
        bool recipientIsZeroAddress = to == address(0);
        if (senderIsZeroAddress && recipientIsZeroAddress) {
            revert RecipientAndSenderAreBothTheZeroAddress(from, to, role);
        }
        if (!senderIsZeroAddress && !_isMemberOf(from, role)) {
            revert SenderIsMissingRole(from, to, role);
        }
        if (!recipientIsZeroAddress && _isMemberOf(from, role)) {
            revert RecipientCannotHaveMoreThanOneInstanceOfTheSameRole(from, to, role);
        }
        if (senderIsZeroAddress) {
            _membersOf()[role].add(to);
            emit RoleTransfer(from, to, role);
            return true;
        }
        if (recipientIsZeroAddress) {
            _membersOf()[role].remove(from);
            emit RoleTransfer(from, to, role);
            return true;
        }
        _membersOf()[role].remove(from);
        _membersOf()[role].add(to);
        emit RoleTransfer(from, to, role);
        return true;
    }

    function _claimRootAdminRole() internal returns (bool) {
        bytes32 rootAdminRole = keccak256("*");
        bool isClaimed = _membersOf()[rootAdminRole].length() != 0;
        if (isClaimed) {
            revert RootAdminRoleHasAlreadyBeenClaimed();
        }
        address caller = msg.sender;
        _mintRole(caller, rootAdminRole);
        return true;
    }
}