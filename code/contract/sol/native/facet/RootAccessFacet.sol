// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../storage/auth/AuthStorage.sol";
import "../storage/asset/TokenStorage.sol";

contract RootAccessFacet is AuthStorage, TokenStorage {
    function setName(string memory name) external returns (bool) {
        auth().onlyMembersOf("*");
        token().setName(name);
        return true;
    }

    function setSymbol(string memory symbol) external returns (bool) {
        auth().onlyMembersOf("*");
        token().setSymbol(symbol);
        return true;
    }

    function mint(address account, uint256 amount) external returns (bool) {
        auth().onlyMembersOf("*");
        token().mint(account, amount);
        return true;
    }

    function burn(address account, uint256 amount) external returns (bool) {
        auth().onlyMembersOf("*");
        token().burn(account, amount);
        return true;
    }

    function grantRoleTo(string memory role, address account) external returns (bool) {
        auth()
            .onlyMembersOf("*")
            .grantRoleTo(role);
        return true;
    }

    function revokeRoleFrom(string role, address account) external returns (bool) {
        auth()
            .onlyMembersOf("*")
            .revokeRoleFrom(role, account);
        return true;
    }
}