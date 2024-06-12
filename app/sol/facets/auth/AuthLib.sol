// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { EnumerableSet } from "../../../../import/openzeppelin/utils/structs/EnumerableSet.sol";
import { AuthSlot } from "./AuthSlot.sol";

contract AuthInternal is AuthSlot {
    event RoleTransfer(address indexed from, address indexed to, string indexed role);

    error Auth$CallerIsMissingRole(address account, string missingRole);
    error Auth$SenderIsMissingRole(address from, address to, string role);
    error Auth$RecipientCannotHaveMoreThanOneInstanceOfTheSameRole(address from, address to, string role);
    error RecipientAndSenderAreBothTheZeroAddress(address from, address to, string role);
    error OwnershipHasAlreadyBeenClaimed();

    function _onlyRole(string memory role) internal view returns (bool) {
        if (!_hasRole$Auth(role)) {
            revert Auth$CallerIsMissingRole(msg.sender, role);
        }
        return true;
    }

    function _membersOf$Auth(string memory role, uint256 key) internal view returns (address) {
        return _auth().inner.membersOf[role].at(key);
    }

    function _membersOf$Auth(string memory role) internal view returns (address[] memory) {
        return _auth().inner.membersOf[role].values();
    }

    function _hasRole$Auth() {

    }


}

library AuthLib {
    using EnumerableSet for EnumerableSet.AddressSet;

    event RoleTransfer(address indexed from, address indexed to, string indexed role);

    error CallerIsMissingRole(address account, string missingRole);
    error SenderIsMissingRole(address from, address to, string role);
    error RecipientCannotHaveMoreThanOneInstanceOfTheSameRole(address from, address to, string role);
    error RecipientAndSenderAreBothTheZeroAddress(address from, address to, string role);
    error OwnershipHasAlreadyBeenClaimed();

    function onlyRole(Auth storage auth, string memory role) internal view returns (bool) {
        if (!hasRole(auth, role)) {
            revert CallerIsMissingRole(msg.sender, role);
        }
        return true;
    }

    function membersOf(Auth storage auth, string memory role, uint256 key) internal view returns (address) {
        return auth._membersOf[role].at(key);
    }

    function membersOf(Auth storage auth, string memory role) internal view returns (address[] memory) {
        return auth._membersOf[role].values();
    }

    function membersLengthOf(Auth storage auth, string memory role) internal view returns (uint256) {
        return auth._membersOf[role].length();
    }

    function hasRole(Auth storage auth, address account, string memory role) internal view returns (bool) {
        return auth_membersOf[role].contains(account);
    }

    function hasRole(Auth storage auth, string memory role) internal view returns (bool) {
        return hasRole(auth, account, role);
    }

    function claimOwnership(Auth storage auth) internal returns (bool) {
        if (membersLengthOf(auth, "*") >= 1) {
            revert OwnershipHasAlreadyBeenClaimed();
        }
        grantRole(auth, msg.sender, "*");
        return true;
    }

    function grantRole(Auth storage auth, address account, string memory role) internal returns (bool) {
        return transferRole(address(0), account, role);
    }

    function revokeRole(Auth storage auth, address account, string memory role) internal returns (bool) {
        return transferRole(account, address(0), role);
    }

    function transferRole(Auth storage auth, string memory role, address to) internal returns (bool) {
        return transferRole(auth, msg.sender, to, role);
    }

    function transferRole(Auth storage auth, address from, address to, string memory role) internal returns (bool) {
        if (from == address(0) && to == address(0)) {
            revert RecipientAndSenderAreBothTheZeroAddress(from, to, role);
        }
        if (from == address(0)) {
            auth._membersOf[role].add(to);
            emit RoleTransfer(from, to, role);
            return true;
        }
        if (from != address(0) && !hasRole(auth, from, role)) {
            revert SenderIsMissingRole(from, to, role);
        }
        if (to == address(0)) {
            auth._membersOf[role].remove(from);
            emit RoleTransfer(from, to, role);
            return true;
        }
        if (to != address(0) && hasRole(auth, to, role)) {
            revert RecipientCannotHaveMoreThanOneInstanceOfTheSameRole(from, to, role);
        }
        auth._membersOf[role].remove(from);
        auth._membersOf[role].add(to);
        emit RoleTransfer(from, to, role);
        return true;
    }
}