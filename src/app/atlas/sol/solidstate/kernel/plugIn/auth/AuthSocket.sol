// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "../../../../import/openzeppelin/utils/structs/EnumerableSet.sol";
import "./AuthStorageSlot.sol";

contract AuthSocket is AuthStorageSlot {
    using EnumerableSet for EnumerableSet.AddressSet;

    event RoleTransfer(address indexed from, address indexed to, string indexed role);

    error CallerIsMissingRole(address account, string missingRole);
    error SenderIsMissingRole(address from, address to, bytes32 role);
    error RecipientCannotHaveMoreThanOneInstanceOfTheSameRole(address from, address to, string role);
    error RecipientAndSenderAreBothTheZeroAddress(address from, address to, string role);
    error OwnershipHasAlreadyBeenClaimed();

    function _onlyRole(string memory role) internal view returns (bool) {
        if (!_hasRole(role)) {
            revert CallerIsMissingRole(msg.sender, role);
        }
        return true;
    }

    function _membersOf(string memory role, uint256 memberId) internal view returns (address) {
        _authStorageSlot().membersOf[role].at(memberId);
    }

    function _membersOf(string memory role) internal view returns (address[] memory) {
        _authStorageSlot().membersOf[role].values();
    }

    function _membersLengthOf(string memory role) internal view returns (uint256) {
        _authStorageSlot().membersOf[role].length();
    }

    function _hasRole(address account, string memory role) internal view returns (bool) {
        return _authStorageSlot().membersOf[role].contains(account);
    }

    function _hasRole(string memory role) internal view returns (bool) {
        return _hasRole(msg.sender, role);
    }

    function _claimOwnership() internal returns (bool) {
        if (_membersLengthOf("owner") >= 1) {
            revert OwnershipHasAlreadyBeenClaimed();
        }
        _transferRole(address(0), msg.sender, "owner");
        return true;
    }

    function _transferRole(address from, address to, string memory role) internal returns (bool) {
        if (from == address(0) && to == address(0)) {
            revert RecipientAndSenderAreBothTheZeroAddress(from, to, role);
        }
        if (from == address(0)) {
            _authStorageSlot().membersOf[role].add(to);
            emit RoleTransfer(from, to, role);
            return true;
        }
        if (from != address(0) && !_hasRole(from, role)) {
            revert SenderIsMissingRole(from, to, role);
        }
        if (to == address(0)) {
            _authStorageSlot().membersOf[role].remove(from);
            emit RoleTransfer(from, to, role);
            return true;
        }
        if (to != address(0) && _hasRole(to, role)) {
            revert RecipientCannotHaveMoreThanOneInstanceOfTheSameRole(from, to, role);
        }
        _authStorageSlot().membersOf[role].remove(from);
        _authStorageSlot().membersOf[role].add(to);
        emit RoleTransfer(from, to, role);
        return true;
    }
}