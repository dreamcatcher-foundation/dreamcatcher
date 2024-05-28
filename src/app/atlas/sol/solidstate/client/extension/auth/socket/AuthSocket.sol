// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "../../../../../import/openzeppelin/utils/structs/EnumerableSet.sol";
import "../slot/AuthSlot.sol";

contract AuthSocket is AuthSlot {
    using EnumerableSet for EnumerableSet.AddressSet;

    event RoleTransfer(address indexed from, address indexed to, bytes32 indexed role);

    error CallerIsMissingRole(address account, bytes32 missingRole);
    error SenderIsMissingRole(address from, address to, bytes32 role);
    error RecipientCannotHaveMoreThanOneInstanceOfTheSameRole(address from, address to, bytes32 role);
    error RecipientAndSenderAreBothTheZeroAddress(address from, address to, bytes32 role);
    error OwnershipHasAlreadyBeenClaimed();

    function _onlyRole(bytes32 role) internal view returns (bool) {
        address caller = msg.sender;
        bool callerDoesNotHaveRequiredRole = !_hasRole(role);
        if (callerDoesNotHaveRequiredRole) {
            revert CallerIsMissingRole(caller, role);
        }
        return true;
    }

    function _hasRole(address account, bytes32 role) internal view returns (bool) {
        return _membersOf()[role].contains(account);
    }

    function _hasRole(bytes32 role) internal view returns (bool) {
        return _hasRole(msg.sender, role);
    }

    function _claimOwnership() internal returns (bool) {
        address caller = msg.sender;
        bytes32 ownerRole = keccak256("owner");
        bool hasAtLeastOneOwner = _membersOf()[ownerRole].length() >= 1;
        if (hasAtLeastOneOwner) {
            revert OwnershipHasAlreadyBeenClaimed();
        }
        _transferRole(address(0), caller, ownerRole);
        return true;
    }

    function _transferRole(address from, address to, bytes32 role) internal returns (bool) {
        bool senderIsZeroAddress = from == address(0);
        bool senderIsNotZeroAddress = !senderIsZeroAddress;
        bool senderHasRole = _hasRole(from, role);
        bool senderDoesNotHaveRole = !senderHasRole;
        bool recipientIsZeroAddress = to == address(0);
        bool recipientisNotZeroAddress = !recipientIsZeroAddress;
        bool recipientHasRole = _hasRole(to, role);
        if (senderIsZeroAddress && recipientIsZeroAddress) {
            revert RecipientAndSenderAreBothTheZeroAddress(from, to, role);
        }
        if (senderIsNotZeroAddress && senderDoesNotHaveRole) {
            revert SenderIsMissingRole(from, to, role);
        }
        if (recipientisNotZeroAddress && recipientHasRole) {
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
}