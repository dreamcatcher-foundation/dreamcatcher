// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { EnumerableSet } from "../../../imports/openzeppelin/utils/structs/EnumerableSet.sol";
import { Role } from "./Role.sol";

library RoleLogic {
    using EnumerableSet for EnumerableSet.AddressSet;
    using RoleLogic for Role;

    error DuplicateMembership();
    error MemberNotFound();

    function members(Role storage role, uint256 i) internal view returns (address) {
        return role._members.at(i);
    }

    function members(Role storage role) internal view returns (address[] memory) {
        return role._members.values();
    }

    function size(Role storage role) internal view returns (uint256) {
        return role._members.length();
    }

    function hasMember(Role storage role, address account) internal view returns (bool) {
        return role._members.contains(account);
    }

    function hasMember(Role storage role) internal view returns (bool) {
        return role.hasMember(msg.sender);
    }

    function grant(Role storage role, address account) internal returns (bool) {
        if (role.hasMember(account)) {
            revert DuplicateMembership();
        }
        role._members.add(account);
        return true;
    }

    function revoke(Role storage role, address account) internal returns (bool) {
        if (!role.hasMember(account)) {
            revert MemberNotFound();
        }
        role._members.remove(account);
        return true;
    }
}