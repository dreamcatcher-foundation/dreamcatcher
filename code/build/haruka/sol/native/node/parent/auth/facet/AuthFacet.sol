// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "../slot/AuthSlot.sol";
import "../socket/AuthSocket.sol";

contract AuthFacet is AuthSlot, AuthSocket {
    function membersOf(bytes32 memory role) external view returns (address[] memory) {
        return _membersOf()[role];
    }

    function claimRootAdminRole() external returns (bool) {
        return _claimRootAdminRole();
    }
}