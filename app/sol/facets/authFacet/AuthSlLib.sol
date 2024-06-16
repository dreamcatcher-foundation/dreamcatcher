// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { EnumerableSet } from "../../imports/openzeppelin/utils/structs/EnumerableSet.sol";
import { AuthSl } from "./AuthSl.sol";

library AuthSlLib {
    using AuthSlLib for AuthSl;
    using EnumerableSet for EnumerableSet.AddressSet;

    event RoleAssignment();
    event RoleRevocation();

    error RootAccessClaimed();
    error MemberNotFound();
    error MemberFound();
    error MissingRole(string memory missingRoleId, address account);

    function onlyRole(AuthSl storage sl, string memory roleId) internal view returns (bool) {
        if (!sl.hasMember(roleId)) {
            revert MissingRole(roleId, msg.sender);
        }
        return true;
    }

    function members(AuthSl storage sl, string memory roleId, uint256 i) internal view returns (address) {
        return sl._members[roleId].at(i);
    }

    function members(AuthSl storage sl, string memory roleId) internal view returns (address[] memory) {
        return sl._members[roleId].values();
    }

    function membersCount(AuthSl storage sl) internal view returns (uint256) {
        return sl._members[roleId].length();
    }

    function hasMember(AuthSl storage sl, string memory roleId, address account) internal view returns (bool) {
        return sl._members[roleId].contains(account);
    }

    function hasMember(AuthSl storage sl, string memory roleId) internal view returns (bool) {
        return sl.hasMember(roleId, msg.sender);
    }

    function claimOwnership(AuthSl storage sl) internal returns (bool) {
        if (sl.membersCount("*") >= 1) {
            revert RootAccessClaimed();
        }
        sl.assignRole("*", msg.sender);
        return true;
    }

    function assignRole(AuthSl storage sl, string memory roleId, address account) internal returns (bool) {
        if (sl.hasMember(roleId, account)) {
            revert MemberFound();
        }
        sl._members[roleId].add(account);
        emit RoleAssignment();
        return true;
    }

    function revokeRole(AuthSl storage sl, string memory roleId, address account) internal returns (bool) {
        if (!sl.hasMember(roleId, account)) {
            revert MemberNotFound();
        }
        sl._members[roleId].remove(account);
        emit RoleRevocation();
        return true;
    }
}