// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Routed } from "./Routed.sol";

contract RoutedSlot {
    bytes32 constant internal _ROUTED_SLOT = bytes32(uint256(keccak256("eip1976.routed")) - 1);

    function _routed() internal pure returns (Routed storage layout) {
        bytes32 slot = _ROUTED_SLOT;
        assembly {
            layout.slot := slot
        }
    }
}