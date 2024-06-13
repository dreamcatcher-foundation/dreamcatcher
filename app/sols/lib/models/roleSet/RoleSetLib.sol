// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { RoleLogic } from "../role/RoleLogic.sol";
import { Role } from "../role/Role.sol";
import { RoleSet } from "./RoleSet.sol";

library RoleSetLib {
    using RoleSetLib for RoleSet;
    using RoleLib for Role;

    struct RoleSet {
        mapping(string => RoleLib.Role) _roles;
    }

    function members(RoleSet storage set, string memory role, uint256 i) internal view returns (address) {
        return set._roles[role].members(i);
    }

    function members(RoleSet storage set, string memory role) internal view returns (address[] memory) {
        return set._roles[role].members();
    }

    function size(RoleSet storage set, string memory role) internal view returns (uint256) {
        return set._roles[role].size();
    }

    function hasMember(RoleSet storage set, string memory role, address account) internal view returns (bool) {
        return set._roles[role].isMember(account);
    }

    function hasMember(RoleSet storage set, string memory role) internal view returns (bool) {
        return set.hasMember(role);
    }

    function grant(RoleSet storage set, string memory role, address account) internal returns (bool) {
        return set._roles[role].grant(account);
    }

    function revoke(RoleSet storage set, string memory role, address account) internal returns (bool) {
        return set._roles[role].revoke(account);
    }
}