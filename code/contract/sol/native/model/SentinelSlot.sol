// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

struct Sentinel {
    mapping(string => address) _diamonds;
    mapping(string => address) _diamondsOwner;
}

contract SentinelSlot {
    bytes32 constant internal _SENTINEL = bytes32(uint256(keccak256("eip1967.sentinel")) - 1);

    function _sentinel() internal pure returns (Sentinel storage sl) {
        bytes32 loc = _SENTINEL;
        assembly {
            sl.slot := loc
        }
    }
}