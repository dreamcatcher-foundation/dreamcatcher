// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;
import './Mod.sol';
import '../../non-native/openzeppelin/utils/structs/EnumerableSet.sol';

contract AuthMod is Mod {
    using EnumerableSet for EnumerableSet.AddressSet;

    event GrantedRole(string indexed role, address indexed account);
    event RevokedRole(string indexed role, address indexed account);

    error MissingRole(address account, string missingRole);

    mapping(bytes32 => EnumerableSet.AddressSet) private _members;

    function membersOf(bytes32 memory role) internal view virtual returns (address[] memory) {
        return _members[role].values();
    }

    function membersOf(bytes32 memory role, uint256 memberId) public view virtual returns (address) {
        return _members[role].at(memberId);
    }

    function membersLength(bytes32 memory role) public view virtual returns (uint256) {
        return _members[role].length();
    }

    function isMemberOf(bytes32 memory role, address account) public view virtual returns (bool) {
        return _members[role].contains(account);
    }

    function grantRoleTo(bytes32 memory role, address account) public returns (bool) {
        _onlyImplementation();
        _members[role].add(account);
        return true;
    }

    function removeRoleFrom(bytes32 memory role, address account) public returns (bool) {
        _onlyImplementation();
        _members[role].remove(account);
        return true;
    }
}