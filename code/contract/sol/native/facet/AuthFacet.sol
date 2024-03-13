// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../storage/auth/AuthStorage.sol";

contract AuthFacet is AuthStorageLib {
    using AuthStorageLib for AuthStorageLib.Auth;

    function membersOf(string memory role) external view returns (address[] memory) {
        return auth().membersOf(role);
    }

    function membersLengthOf(string memory role) external view returns (uint256) {
        return auth().membersLengthOf(role);
    }

    function isMemberOf(string memory role, address account) external view returns (bool) {
        return auth().isMemberOf(role, account);
    }

    function claim() external returns (bool) {
        auth().claim();
        return true;
    }
}