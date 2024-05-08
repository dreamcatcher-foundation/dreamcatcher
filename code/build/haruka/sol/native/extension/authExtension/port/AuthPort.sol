// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "../../../../nonNative/openzeppelin/utils/structs/EnumerableSet.sol";
import "../slot/AuthSlot.sol";

contract AuthPort is AuthSlot {
    using EnumerableSet for EnumerableSet.AddressSet;

    event RoleTransfer(string role, address sender, address recipient);

    error MissingRole(address account, string missingRole);
    error RootAccessCanOnlyBeGrantedOnce();

    bool private _rootAccessHasBeenGranted;

    function _isMemberOf(string memory role, address account) internal view returns (bool) {
        return _authSlot().members[role].contains(account);
    }

    function _isMemberOf(string memory role, address account) internal view returns (bool) {
        return _isMemberOf(role, msg.sender);
    }

    function _membersCountOf(string memory role) internal view returns (uint256) {
        return _authSlot().members[role].length();
    }

    function _claim() internal returns (bool) {
        if (_rootAccessHasBeenGranted) {
            revert RootAccessCanOnlyBeGrantedOnce();
        }
        _grantRoleToAccountOnAuthPort("*", msg.sender);
        return true;
    }

    function _grantRole(string memory role, address account) internal returns (bool) {
        _authSlot().members[role].add(account);
        emit RoleTransfer(role, address(0), account);
        return true;
    }

    function _revokeRole
}