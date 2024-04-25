// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "./AuthPort.sol";

contract RootAccessFacet is AuthPort {
    function claim() external returns (bool) {
        return _claim();
    }

    function grantRoleTo(string memory role, address account) external onlyMemberOf("*") returns (bool) {
        return _grantRoleTo(role, account);
    }

    function revokeRoleFrom(string memory role, address account) external onlyMemberOf("*") returns (bool) {
        return _revokeRoleFrom(role, account);
    }
}