// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../imports/openzeppelin/utils/structs/EnumerableSet.sol";

library RoleLibrary {
    using EnumerableSet for EnumerableSet.AddressSet;

    struct Role {
        EnumerableSet.AddressSet _members;
        string _name;
        bool _willEnforceItsMinimumMembersLength;
        bool _willEnforceItsMaximumMembersLength;
        bool _willBypassItsPermissionChecksIfItDoesNotHaveAnyMembers;
        uint _minimumMembersLength;
        uint _maximumMembersLength;
    }

    event Role__HasChangedItsName(string indexed oldName, string indexed newName);

    event Role__WillEnforceItsMinimumMembersLength(string indexed roleName);

    event Role__WillNotEnforceItsMinimumMembersLength(string indexed roleName);

    event Role__WillEnforceItsMaximumMembersLength(string indexed roleName);

    event Role__WillNotEnforceItsMaximumMembersLength(string indexed roleName);

    event Role__WillBypassItsPermissionChecksIfItDoesNotHaveAnyMembers(string indexed roleName);

    event Role__WillNotBypassItsPermissionChecksIfItDoesNotHaveAnyMembers(string indexed roleName);

    event Role__HasChangedItsMinimumMembersLength(string indexed roleName, uint indexed oldMinimumMembersLength, uint indexed newMinimumMembersLength);

    event Role__HasChangedItsMaximumMembersLength(string indexed roleName, uint indexed oldMaximumMembersLength, uint indexed newMaximumMembersLength);

    function members(Role storage role, uint position) internal view returns (address) {
        return role._members.at(position);
    }

    function members(Role storage role) internal view returns (address[] memory) {
        return role._members.values();
    }

    function name(Role storage role) internal view returns (string memory) {
        return role._name;
    }

    function willEnforceItsMinimumMembersLength(Role storage role) internal view returns (bool) {
        return role._willEnforceItsMinimumMembersLength;
    }

    function willEnforceItsMaximumMembersLength(Role storage role) internal view returns (bool) {
        return role._willEnforceItsMaximumMembersLength;
    }

    function willBypassItsPermissionChecksIfItDoesNotHaveAnyMembers(Role storage role) internal view returns (bool) {
        return role._willBypassItsPermissionChecksIfItDoesNotHaveAnyMembers;
    }

    function minimumMembersLength(Role storage role) internal view returns (uint) {
        return role._minimumMembersLength;
    }

    function maximumMembersLength(Role storage role) internal view returns (uint) {
        return role._maximumMembersLength;
    }

    function setName(Role storage role, string memory newName) internal {
        string memory oldName = name(role);
        _setName(role, newName);
        emit Role__HasChangedItsName(oldName, newName);
    }







    function _setName(Role storage role, string memory newName) private {
        role._name = newName;
    }

    function _enforceMinimumMembersLength(Role storage role) private {
        role._willEnforceItsMinimumMembersLength = true;
    }

    function _doNotEnforceMinimumMembersLength(Role storage role) private {
        role._willEnforceItsMinimumMembersLength = false;
    }

    function _enforceMaximumMembersLength(Role storage role) private {
        role._willEnforceItsMaximumMembersLength = true;
    }

    function _doNotEnforceMaximumMembersLength(Role storage role) private {
        role._willEnforceItsMaximumMembersLength = false;
    }

    function _bypassPermissionChecksIfThereAreNoMembers(Role storage role) private {
        
    }



    function _doNotAllowCheckMinimumMembersLength(Role storage role) private {
        role._hasMinimumMembersLength = false;
    }

    function _enableMaximumMembersLength(Role storage role) private {
        role._hasMaximumMembersLength = true;
    }

    function _disableMaximumMembersLength(Role storage role) private {
        role._hasMaximumMembersLength = false;
    }

    function _enableClaimWithAFeeInAToken(Role storage role) private {
        role._canBeClaimedWithAFeeInAToken = true;
    }

    function _disableClaimWithAFeeInAToken(Role storage role) private {
        role._canBeClaimedWithAFeeInAToken = false;
    }

    function _enableClaimWithOwnershipOfAToken(Role storage role) private {
        role._canBeClaimedWithOwnershipOfAToken = true;
    }

    function _disableClaimWithOwnershipOfAToken(Role storage role) private {
        role._canBeClaimedWithOwnershipOfAToken = false;
    }

    function _checkTheCallerOnlyIfItHasAnyMembers(Role storage role) private {
        role._willCheckTheCallerOnlyIfItHasAnyMembers = true;
    }

    function _doNotCheckTheCallerOnlyIfItHasAnyMembers(Role storage role) private {
        role._willCheckTheCallerOnlyIfItHasAnyMembers = false;
    }

    function _setMinimumMembersLength(Role storage role, uint newMinimumMembersLength) private {
        role._minimumMembersLength = newMinimumMembersLength;
    }

    function _setMaximumMembersLength(Role storage role, uint newMaximumMembersLength) private {
        role._maximumMembersLength = newMaximumMembersLength;
    }

    function _setAmountOfTokensRequiredByClaimFromFee(Role storage role, uint newAmountOfTokensRequiredByClaimFromFee) private {
        role._amountOfTokensRequiredByClaimFromFee = newAmountOfTokensRequiredByClaimFromFee;
    }

    function _setAmountOfTokensOwnedRequiredByClaimFromOwnership(Role storage role, uint newAmountOfTokensOwnedRequiredByClaimFromOwnership) private {
        role._amountOfTokensOwnedRequiredByClaimFromOwnership = newAmountOfTokensOwnedRequiredByClaimFromOwnership;
    }

    function _setTokenRequiredByClaimFromFee(Role storage role, address newTokenRequiredByClaimFromFee) private {
        role._tokenRequiredByClaimFromFee = newTokenRequiredByClaimFromFee;
    }

    function _setTokenRequiredByClaimFromOwnership(Role storage role, address newTokenRequiredByClaimFromOwnership) private {
        role._tokenRequiredByClaimFromOwnership = newTokenRequiredByClaimFromOwnership;
    }
}