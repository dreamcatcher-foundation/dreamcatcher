// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { AuthSlot } from "./AuthSlot.sol";

contract AuthSdk is AuthSlot {
    using EnumerableSet for EnumerableSet.AddressSet;

    event RoleTransfer(address indexed from, address indexed to, string indexed role);

    error CallerIsMissingRole(address account, string missingRole);
    error SenderIsMissingRole(address from, address to, string role);
    error RecipientCannotHaveMoreThanOneInstanceOfTheSameRole(address from, address to, string role);
    error RecipientAndSenderAreBothTheZeroAddress(address from, address to, string role);
    error OwnershipHasAlreadyBeenClaimed();

    modifier onlyRole(string memory role) {
        _onlyRole(role);
        _;
    }

    function _onlyRole(string memory role) internal view returns (bool) {
        if (!_hasRole(role)) {
            revert CallerIsMissingRole(msg.sender, role);
        }
        return true;
    }

    function _membersOf(string memory role, uint256 key) internal view returns (address) {
        return _membersOf()[role].at(memberId);
    }

    function _membersLengthOf(string memory role) internal view returns (uint256) {
        return _membersOf()[role].length();
    }

    function _hasRole(address account, string memory role) internal view returns (bool) {
        return _membersOf()[role].contains(account);
    }

    function _hasRole(string memory role) internal view returns (bool) {
        return _hasRole(msg.sender, role);
    }

    function _claimOwnership() internal returns (bool) {
        if (_membersLengthOf("*") >= 1) {
            revert OwnershipHasAlreadyBeenClaimed();
        }
        _transferRole(address(0), msg.sender, "*");
        return true;
    }

    function _transferRole(address from, address to, string memory role) internal returns (bool) {
        if (from == address(0) && to == address(0)) {
            revert RecipientAndSenderAreBothTheZeroAddress(from, to, role);
        }
        if (from == address(0)) {
            _membersOf()[role].add(to);
            emit RoleTransfer(from, to, role);
            return true;
        }
        if (from != address(0) && !_hasRole(from, role)) {
            revert SenderIsMissingRole(from, to, role);
        }
        if (to == address(0)) {
            _membersOf()[role].remove(from);
            emit RoleTransfer(from, to, role);
            return true;
        }
        if (to != address(0) && _hasRole(to, role)) {
            revert RecipientCannotHaveMoreThanOneInstanceOfTheSameRole(from, to, role);
        }
        _membersOf()[role].remove(from);
        _membersOf()[role].add(to);
        emit RoleTransfer(from, to, role);
        return true;
    }
}