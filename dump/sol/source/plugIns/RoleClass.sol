// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library RoleLogicLibrary {
    struct Role {
        mapping(address => bool) _isAMember;
    }

    error AnAccountIsMissingARequiredRole(address account);

    function isAMember(Role storage role, address account) internal view returns (bool) {
        return role._isAMember[account];
    }

    function requireThatTheAccountIsAMember(Role storage role, address account) internal view returns (bool) {

    }
}



library RoleClsass {
    using EnumerableSet for EnumerableSet.AddressSet;

    struct Role {
        EnumerableSet.AddressSet _members;
        string _name;
        bool _willEnforceItsMinimumMemberCount;
        bool _willEnforceItsMaximumMemberCount;
        uint _minimumMemberCount;
        uint _maximumMemberCount;
    }

    event AnAccountHasHadARoleGrantedToThem(address indexed account, string indexed nameOfRole);

    event AnAccountHasHadARoleRevokedFromThem(address indexed account, string indexed roleName);

    event ARoleHasBeenRenamed(string indexed oldRoleName, string indexed newRoleName);

    event ARoleHasStartedEnforcingItsMinimumMemberCount(string indexed roleName);

    event ARoleHasStoppedEnforcingItsMinimumMemberCount(string indexed roleName);

    event ARoleHasStartedEnforcingItsMaximumMemberCount(string indexed roleName);

    event ARoleHasStoppedEnforcingItsMaximumMemberCount(string indexed roleName);

    event ARoleHasChangedItsMinimumMemberCount(string indexed roleName, uint indexed oldMinimumMemberCount, uint indexed newMinimumMemberCount);

    event ARoleHasChangedItsMaximumMemberCount(string indexed roleName, uint indexed oldMaximumMemberCount, uint indexed newMaximumMemberCount);

    error AnAccountIsMissingARequiredRole(address account, string memory missingRoleName);

    error ARoleCannotGrantMembershipIfTheAccountIsAlreadyAMember(address account, string memory roleName);

    error ARoleCannotRevokeMembershipFromAnAccountThatIsNotAMember(address account, string memory roleName);

    error ARoleIsEnforcingItsMinimumMemberCountAndIsAtOrBelowTheRequiredCount(string memory roleName, uint currentMemberCount, uint minimumMemberCount);

    error ARoleIsEnforcingItsMaximumMemberCountAndIsAtOrAboveTheRequiredCount(string memory roleName, uint currentMemberCount, uint maximumMemberCount);

    function members(Role storage role, uint index) internal view returns (address) {
        return role._members.at(index);
    }

    function members(Role storage role) internal view returns (address[] memory) {
        return role._members.values();
    }

    function numberOfMembers(Role storage role) internal view returns (uint) {
        return role._members.length();
    }

    function isAMemberOf(Role storage role, address account) internal view returns (bool) {
        return role._members.contains(account);
    }

    function isNotAMemberOf(Role storage role, address account) internal view returns (bool) {
        return !isAMemberOf(role, account);
    }

    function name(Role storage role) internal view returns (string memory) {
        return role._name;
    }

    function willEnforceItsMinimumMemberCount(Role storage role) internal view returns (bool) {
        return role._willEnforceItsMinimumMemberCount;
    }

    function willEnforceItsMaximumMemberCount(Role storage role) internal view returns (bool) {
        return role._willEnforceItsMaximumMemberCount;
    }

    function minimumNumberOfMembers(Role storage role) internal view returns (uint) {
        return role._minimumMemberCount;
    }

    function maximumNumberOfMembers(Role storage role) internal view returns (uint) {
        return role._maximumMemberCount;
    }

    function _ifTheAccountIsAlreadyAMember(Role storage role) private view returns (bool) {
        if (isAMemberOf(role, account)) {
            revert ARoleCannotGrantMembershipIfTheAccountIsAlreadyAMember(account, name(role));
        }
    }

    function _ifTheRoleIsEnforcingItsMaximumNumberOfMembers(Role storage role) private view returns (bool) {
        if (numberOfMembers(role) >= maximumNumberOfMembers(role)) {
            revert ARoleIsEnforcingItsMaximumMemberCountAndIsAtOrAboveTheRequiredCount(role);
        }
    }

    function _grantMembershipTo(Role storage role, address account) private returns (bool) {
        _ifTheAccountIsAlreadyAMember();
        _ifTheRoleIsEnforcingItsMaximumNumberOfMembers();
        _addAMember(role, account);
        return true;
    }

    function _revokeMembershipFrom(Role storage role, address account) private returns (bool) {
        if (isNotAMemberOf(role, account)) {
            revert ARoleCannotRevokeMembershipFromAnAccountThatIsNotAMember(account, name(role));
        }
        if (numberOfMembers(role) <= minimumNumberOfMembers(role)) {
            revert ARoleIsEnforcingItsMinimumMemberCountAndIsAtOrBelowTheRequiredCount(role);
        }

    }

    function _addAMember(Role storage role, address newMember) private returns (bool) {
        role._members.add(account);
        return true;
    }

    function _removeAMember(Role storage role, address member) private returns (bool) {
        role._members.remove(account);
    }
    
}




library RoleCwlass {
    using EnumerableSet for EnumerableSet.AddressSet;

    struct Role {
        EnumerableSet.AddressSet _members;
        string _name;
        bool _willEnforceItsMinimumNumberOfMembers;
        bool _willEnforceItsMaximumNumberOfMembers;
        uint _possiblyEnforceableMinimumNumberOfMembers;
        uint _possiblyEnforceableMaximumNumberOfMembers;
    }

    event AnAccountHasHadARoleGrantedToThem(address indexed account, string indexed nameOfTheRole);

    event AnAccountHasHadARoleRevokedFromThem(address indexed account, string indexed nameOfTheRole);

    event TheNameOfARoleHasBeenChanged(string indexed oldName, string indexed newName);

    event ARoleWillEnforceItsMinimumNumberOfMembers(string indexed nameOfTheRole, uint indexed enforceableMinimumNumberOfMembers);

    event ARoleWillEnforceItsMaximumNumberOfMembers(string indexed nameOfTheRole, uint indexed enforceableMaximumNumberOfMembers);

    event ARoleWillNotEnforceItsMinimumNumberOfMembers(string indexed nameOfTheRole, uint indexed enforceableMinimumNumberOfMembers);

    event ARoleWillNotEnforceItsMaximumNumberOfMembers(string indexed nameOfTheRole, uint indexed enforceableMaximumNumberOfMembers);

    event ThePossiblyEnforceableMinimumNumberOfMembersOfARoleHasBeenChanged(string indexed nameOfTheRole, uint oldPossiblyEnforceableMinimumNumberOfMembers, uint newPossiblyEnforceableMinimumNumberOfMembers);

    event ThePossiblyEnforceableMaximumNumberOfMembersOfARoleHasBeenChanged(string indexed nameOfTheRole, uint oldPossiblyEnforceableMaximumNumberOfMembers, uint newPossiblyEnforceableMaximumNumberOfMembers);

    error AnAccountIsMissingARequiredRole(address account, string nameOfTheMissingRole);

    error TheRoleCannotGrantMembershipToAMember(address account, string nameOfTheRole);

    error TheRoleCannotRevokeMembershipFromANonMember(address account, string nameOfTheRole);

    function members(Role storage role, uint index) internal view returns (address) {
        return role._members.at(index);
    }

    function members(Role storage role) internal view returns (address[] memory) {
        return role._members.values();
    }

    function isAMember(Role storage role, address account) internal view returns (bool) {
        return role._members.contains(account);
    }

    function isNotAMember(Role storage role, address account) internal view returns (bool) {
        return !isAMember(role, account);
    }

    function name(Role storage role) internal view returns (string memory) {
        return role._name;
    }

    function willEnforceItsMinimumNumberOfMembers(Role storage role) internal view returns (bool) {
        return role._willEnforceItsMinimumNumberOfMembers;
    }

    function willEnforceItsMaximumNumberOfMembers(Role storage role) internal view returns (bool) {
        return role._willEnforceItsMaximumNumberOfMembers;
    }

    function possiblyEnforceableMinimumNumberOfMembers(Role storage role) internal view returns (uint) {
        return role._possiblyEnforceableMinimumNumberOfMembers;
    }

    function possiblyEnforceableMaximumNumberOfMembers(Role storage role) internal view returns (uint) {
        return role._possiblyEnforceableMaximumNumberOfMembers;
    }

    function requireThatThisAccountIsAMemberOrRevert(Role storage role, address account) internal view returns (bool) {
        if (isNotAMember(role, account)) {
            revert AnAccountIsMissingARequiredRole(account, name(role));
        }
        return true;
    }

    function requireThatTheCallerIsAMemberOrRevert(Role storage role) internal view returns (bool) {
        requireThatThisAccountIsAMemberOrRevert(role, msg.sender);
        return true;
    }

    function _addAMember(Role storage role, address account) private returns (bool) {
        if (isAMember(role, account)) {
            revert TheRoleCannotGrantMembershipToAMember()
        }
        role._members.add(account);
        return true;
    }
}


library RoleLogicLisbrary {
    using EnumerableSet for EnumerableSet.AddressSet;

    struct Role {
        EnumerableSet.AddressSet _members;
        string _name;
        bool _willEnforceItsMinimumNumberOfMembers;
        bool _willEnforceItsMaximumNumberOfMembers;
        uint _possiblyEnforceableMinimumNumberOfMembers;
        uint _possiblyEnforceableMaximumNumberOfMembers;
    }

    event AnAccountHasHadARoleGrantedToThem();

    event AnAccountHasHadARoleRevokedFromThem();

    event TheNameOfARoleHasBeenChanged(string indexed oldName, string indexed newName);

    event ARoleWillEnforceItsMinimumNumberOfMembers(string indexed nameOfTheRole);

    event ARoleWillNotEnforceItsMinimumNumberOfMembers(string indexed nameOfTheRole);

    event ThePossiblyEnforceableMinimumNumberOfMembersOfARoleHasBeenChanged(string indexed nameOfTheRole, uint oldPossiblyEnforceableMinimumNumberOfMembers, uint newPossiblyEnforceableMinimumNumberOfMembers);

    event ThePossiblyEnforceableMaximumNumberOfMembersOfARoleHasBeenChanged(string indexed nameOfTheRole, uint oldPossiblyEnforceableMaximumNumberOfMembers, uint newPossiblyEnforceableMaximumNumberOfMembers);

    error AnAccountIsMissingARequiredRole(address account, string nameOfTheMissingRole);

    function members(Role storage role, uint index) internal view returns (address) {
        return role._members.at(index);
    }

    function members(Role storage role) internal view returns (address[] memory) {
        return role._members.values();
    }

    function isAMemberOf(Role storage role, address account) internal view returns (bool) {
        return role._members.contains(account);
    }

    function isNotAMemberOf(Role storage role, address account) internal view returns (bool) {
        return !isAMemberOf(role, account);
    }

    function name(Role storage role) internal view returns (string memory) {
        return role._name;
    }

    function willEnforceItsMinimumNumberOfMembers(Role storage role) internal view returns (bool) {
        return role._willEnforceItsMinimumNumberOfMembers;
    }

    function willEnforceItsAMaximumNumberOfMembers(Role storage role) internal view returns (bool) {
        return role._willEnforceItsMaximumNumberOfMembers;
    }

    function possiblyEnforceableMinimumNumberOfMembers(Role storage role) internal view returns (uint) {
        return role._possiblyEnforceableMinimumNumberOfMembers;
    }

    function possiblyEnforceableMaximumNumberOfMembers(Role storage role) internal view returns (uint) {
        return role._possiblyEnforceableMaximumNumberOfMembers;
    }

    function accountMustBeAMemberOfThisRole(Role storage role, address account) internal view {
        if (isNotAMemberOf(role, account)) {
            revert AnAccountIsMissingARequiredRole(account, name(role));
        }
    }

    function callerMustBeAMemberOfThisRole(Role storage role) internal view {
        requirePermissionOf(role, msg.sender);
    }

    function changeName(Role storage role, string memory newName) internal returns (bool) {
        string memory oldName = name(role);
        _changeName(role, newName);
        emit TheNameOfARoleHasBeenChanged(oldName, newName);
        return true;
    }

    function addANewMember(Role storage role, address account) private returns (bool) {

    }

    function _addANewMember(Role storage role, address account) private returns (bool) {
        role._members.add(account);
        return true;
    }

    function _removeAMember(Role storage role, address account) private returns (bool) {
        role._members.remove(account);
        return true;
    }

    function _changeName(Role storage role, string memory newName) private returns (bool) {
        role._name = newName;
        return true;
    }
}