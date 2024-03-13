// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../storage/auth/AuthStorage.sol";

contract AuthFacet is AuthStorage {
    using AuthStorageLib for AuthStorageLib.Auth;

    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory response = new bytes4[](4);
        response[0] = bytes4(keccak256("membersOf(string)"));
        response[1] = bytes4(keccak256("membersLengthOf(string)"));
        response[2] = bytes4(keccak256("isMemberOf(string,address)"));
        response[3] = bytes4(keccak256("claim()"));
        return response;
    }

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