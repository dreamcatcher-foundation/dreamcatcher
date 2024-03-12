// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./RoleClass.sol";

contract PublicRoleSlot {
    bytes32 internal constant _public = keccak256("public-role-slot");

    function public() internal pure returns (RoleClass.Role storage s) {
        bytes32 location = _public;
        assembly {
            s.slot := location;
        }
    }
}