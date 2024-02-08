// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "contracts/polygon/interfaces/IProxyStateOwnable.sol";

interface IRole is IProxyStateOwnable {

    /**
    * @dev Emitted when a role is granted to an account.
    * @param account The address of the account to which the role is granted.
    * @param role The string representing the role that is granted.
    * @dev The `indexed` keyword is used for efficient event filtering based on the specified account and role.
    */
    event Granted(address indexed account, string indexed role);

    /**
    * @dev Emitted when a role is revoked from an account.
    * @param account The address of the account from which the role is revoked.
    * @param role The string representing the role that is revoked.
    * @dev The `indexed` keyword is used for efficient event filtering based on the specified account and role.
    */
    event Revoked(address indexed account, string indexed role);

    /**
    * @dev Emitted when ownership of the contract is transferred to a new account.
    * @param account The address of the account to which ownership is transferred.
    * @param role The string representing the role associated with the new owner.
    * @dev The `indexed` keyword is used for efficient event filtering based on the specified account and role.
    */
    event OwnershipTransferred(address indexed from, address indexed to, string indexed role);

    /**
    * @dev Error event indicating that an unauthorized action was attempted.
    * @param account The address of the account attempting the unauthorized action.
    * @param roleRequired The string representing the role that was required for the action.
    * @dev The `indexed` keyword is used for efficient error tracking based on the specified account and required role.
    */
    error Unauthorized(address account, string roleRequired);

    /**
    * @dev Error event indicating that a duplicate assignment of a role to an account was attempted.
    * @param account The address of the account for which the duplicate assignment was attempted.
    * @param role The string representing the role that was attempted to be assigned.
    * @dev The `indexed` keyword is used for efficient error tracking based on the specified account and role.
    */
    error DuplicateAssignment(address account, string role);

    /**
    * @dev Error event indicating that a duplicate unassignment of a role from an account was attempted.
    * @param account The address of the account for which the duplicate unassignment was attempted.
    * @param role The string representing the role that was attempted to be unassigned.
    * @dev The `indexed` keyword is used for efficient error tracking based on the specified account and role.
    */
    error DuplicateUnassignment(address account, string role);

    /**
    * @dev Error event indicating that an update or modification was attempted, but the action has already been performed.
    * @dev The error is typically thrown when trying to update a contract state that should only be updated once.
    */
    error AlreadyUpdated();

    /**
    * @dev Public function to retrieve the addresses of members belonging to a specific role.
    * @param role The string representing the role for which members' addresses are queried.
    * @return An array of addresses representing the members associated with the specified role.
    */
    function members(string memory role) external view returns (address[] memory);

    /**
    * @dev Public function to retrieve the number of members belonging to a specific role.
    * @param role The string representing the role for which the number of members is queried.
    * @return The total number of members associated with the specified role.
    */
    function membersLength(string memory role) external view returns (uint256);

    /**
    * @dev Public function to check if an account belongs to a specific role.
    * @param account The address of the account to be checked.
    * @param role The string representing the role for which membership is checked.
    * @return A boolean indicating whether the account is a member of the specified role.
    */
    function isRole(address account, string memory role) external view returns (bool);

    /**
    * @dev Public function to require that an account belongs to a specific role.
    * @param account The address of the account to be checked.
    * @param role The string representing the role that the account is required to have.
    * @dev Throws an `Unauthorized` error if the account does not have the specified role.
    */
    function requireRole(address account, string memory role) external view;

    /**
    * @dev Public function to perform an update, granting additional roles to the sender.
    * @dev The update can only be performed once to prevent redundant updates.
    * @dev Grants the "GRANTER_ROLE" and "REVOKER_ROLE" roles to the sender.
    * @dev Throws an `AlreadyUpdated` error if the update has already been performed.
    */
    function update() external;

    /**
    * @dev Public function to grant a role to a specified account.
    * @param account The address of the account to which the role is granted.
    * @param role The string representing the role to be granted.
    * @dev Requires the sender to have the "GRANTER_ROLE" in order to perform the action.
    * @dev Emits a `Granted` event upon successful granting of the role.
    * @dev Throws a `Unauthorized` error if the sender lacks the necessary role for the action.
    * @dev Throws a `DuplicateAssignment` error if the role is already assigned to the specified account.
    */
    function grant(address account, string memory role) external;

    /**
    * @dev Public function to revoke a role from a specified account.
    * @param account The address of the account from which the role is revoked.
    * @param role The string representing the role to be revoked.
    * @dev Requires the sender to have the "REVOKER_ROLE" in order to perform the action.
    * @dev Emits a `Revoked` event upon successful revocation of the role.
    * @dev Throws a `Unauthorized` error if the sender lacks the necessary role for the action.
    */
    function revoke(address account, string memory role) external;

    /**
    * @dev Public function to renounce a specified role, effectively relinquishing ownership.
    * @param role The string representing the role to be renounced.
    * @dev Revokes the sender's ownership role, making the sender no longer the owner.
    * @dev Emits an `OwnershipTransferred` event upon successful ownership renouncement.
    * @dev Throws a `DuplicateUnassignment` error if the sender's ownership role is not assigned.
    */
    function renounceRole(string memory role) external;
}