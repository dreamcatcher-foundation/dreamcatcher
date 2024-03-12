// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./RoleClass.sol";

contract AdminRoleSlot {
    bytes32 internal constant _admins = keccak256("admins-role-slot");

    function admins() internal pure returns (RoleClass.Role storage s) {
        bytes32 location = _admins;
        assembly {
            s.slot := location;
        }
    }
}