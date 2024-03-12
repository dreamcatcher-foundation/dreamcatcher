// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import '../../../non-native/openzeppelin/utils/structs/EnumerableSet.sol';

library AuthStorageLibrary {
    using EnumerableSet for EnumerableSet.AddressSet;

    error MissingRole(address account, string missingRole);

    event GrantedRole(string role, address account);
    event RevokedRole(string role, address account);

    struct Auth {
        Hidden hidden;
    }

    struct Hidden {
        mapping(string => EnumerableSet.AddressSet) members;
    }

    function membersOf(Auth storage auth, string memory role) internal view returns (address[] memory) {
        return auth.hidden.members[role].values();
    }

    function membersLengthOf(Auth storage auth, string memory role) internal view returns (uint256) {
        return auth.hidden.members[role].length();
    }

    function isMemberOf(Auth storage auth, string memory role, address account) internal view returns (bool) {
        return auth.hidden.members[role].contains(account);
    }

    function isMemberOf(Auth storage auth, string memory role) internal view returns (bool) {
        return isMemberOf(auth, role, msg.sender);
    }

    function grantRoleTo(Auth storage auth, string memory role, address account) internal returns (Auth storage) {
        auth.hidden.members[role].add(account);
        emit GrantedRole(role, account);
        return auth;
    }

    function grantRoleTo(Auth storage auth, string memory role) internal returns (Auth storage) {
        return grantRoleTo(auth, role, msg.sender);
    }

    function revokeRoleFrom(Auth storage auth, string memory role, address account) internal returns (Auth storage) {
        auth.hidden.members[role].remove(account);
        emit RevokedRole(role, account);
        return auth;
    }

    function revokeRoleFrom(Auth storage auth, string memory role) internal returns (Auth storage) {
        return revokeRoleFrom(auth, role, msg.sender);
    }

    function claim(Auth storage auth) internal returns (Auth storage) {
        require(membersLengthOf(auth, '*') == 0, 'AuthStorageLibrary: cannot only grant the "*" role when there are no members');
        grantRoleTo(auth, '*', msg.sender);
        return auth;
    }

    function onlyMembersOf(Auth storage auth, string memory role, address account) internal view returns (Auth storage) {
        if (!isMemberOf(auth, role, account)) {
            revert MissingRole(account, role);
        }
        return auth;
    }

    function onlyMembersOf(Auth storage auth, string memory role) internal view returns (Auth storage) {
        return onlyMembersOf(auth, role, msg.sender);
    }
}

contract AuthStorage {
    bytes32 constant AUTH = bytes32(uint256(keccak256('eip1967.auth')) - 1);

    function auth() internal pure returns (AuthStorageLibrary.Auth storage sl) {
        assembly {
            sl.slot := AUTH
        }
    }
}