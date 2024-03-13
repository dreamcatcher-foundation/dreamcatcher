// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../../../non-native/openzeppelin/utils/structs/EnumerableSet.sol";

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

    /**
     * @dev Returns the array of members of a specific role.
     * @param auth The Auth struct containing role memberships.
     * @param role The role for which to retrieve the members.
     * @return address[] An array of member addresses.
     */
    function membersOf(Auth storage auth, string memory role) internal view returns (address[] memory) {
        return auth.hidden.members[role].values();
    }

    /**
     * @dev Returns the count of members in a specific role.
     * @param auth The Auth struct containing role memberships.
     * @param role The role for which to retrieve the count.
     * @return uint256 The count of members in the role.
     */
    function membersLengthOf(Auth storage auth, string memory role) internal view returns (uint256) {
        return auth.hidden.members[role].length();
    }

    /**
     * @dev Checks if an account is a member of a specific role.
     * @param auth The Auth struct containing role memberships.
     * @param role The role to check for membership.
     * @param account The account to check for membership.
     * @return bool True if the account is a member of the role, false otherwise.
     */
    function isMemberOf(Auth storage auth, string memory role, address account) internal view returns (bool) {
        return auth.hidden.members[role].contains(account);
    }

    /**
     * @dev Checks if the message sender is a member of a specific role.
     * @param auth The Auth struct containing role memberships.
     * @param role The role to check for membership.
     * @return bool True if the message sender is a member of the role, false otherwise.
     */
    function isMemberOf(Auth storage auth, string memory role) internal view returns (bool) {
        return isMemberOf(auth, role, msg.sender);
    }

    /**
     * @dev Grants a role to an account.
     * @param auth The Auth struct containing role memberships.
     * @param role The role to grant.
     * @param account The account to grant the role to.
     * @return Auth The updated Auth struct.
     */
    function grantRoleTo(Auth storage auth, string memory role, address account) internal returns (Auth storage) {
        auth.hidden.members[role].add(account);
        emit GrantedRole(role, account);
        return auth;
    }

    /**
     * @dev Grants a role to the message sender.
     * @param auth The Auth struct containing role memberships.
     * @param role The role to grant.
     * @return Auth The updated Auth struct.
     */
    function grantRoleTo(Auth storage auth, string memory role) internal returns (Auth storage) {
        return grantRoleTo(auth, role, msg.sender);
    }

    /**
     * @dev Revokes a role from an account.
     * @param auth The Auth struct containing role memberships.
     * @param role The role to revoke.
     * @param account The account to revoke the role from.
     * @return Auth The updated Auth struct.
     */
    function revokeRoleFrom(Auth storage auth, string memory role, address account) internal returns (Auth storage) {
        auth.hidden.members[role].remove(account);
        emit RevokedRole(role, account);
        return auth;
    }

    /**
     * @dev Revokes a role from the message sender.
     * @param auth The Auth struct containing role memberships.
     * @param role The role to revoke.
     * @return Auth The updated Auth struct.
     */
    function revokeRoleFrom(Auth storage auth, string memory role) internal returns (Auth storage) {
        return revokeRoleFrom(auth, role, msg.sender);
    }

    /**
     * @dev Grants the "*" role to the message sender.
     * @param auth The Auth struct containing role memberships.
     * @return Auth The updated Auth struct.
     */
    function claim(Auth storage auth) internal returns (Auth storage) {
        require(membersLengthOf(auth, "*") == 0, "AuthStorageLibrary: cannot only grant the '*' role when there are no members");
        grantRoleTo(auth, "*", msg.sender);
        return auth;
    }

    /**
     * @dev Ensures that the message sender is a member of a specific role.
     * @param auth The Auth struct containing role memberships.
     * @param role The role to check for membership.
     * @param account The account to check for membership.
     * @return Auth The Auth struct.
     */
    function onlyMembersOf(Auth storage auth, string memory role, address account) internal view returns (Auth storage) {
        if (!isMemberOf(auth, role, account)) {
            revert MissingRole(account, role);
        }
        return auth;
    }

    /**
     * @dev Ensures that the message sender is a member of a specific role.
     * @param auth The Auth struct containing role memberships.
     * @param role The role to check for membership.
     * @return Auth The Auth struct.
     */
    function onlyMembersOf(Auth storage auth, string memory role) internal view returns (Auth storage) {
        return onlyMembersOf(auth, role, msg.sender);
    }
}

contract AuthStorage {
    bytes32 constant AUTH = bytes32(uint256(keccak256("eip1967.auth")) - 1);

    /**
     * @dev Returns the storage pointer for the Auth struct.
     * @return AuthStorageLibrary.Auth The Auth struct storage pointer.
     */
    function auth() internal pure returns (AuthStorageLibrary.Auth storage sl) {
        assembly {
            sl.slot := AUTH
        }
    }
}