// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

struct Router {
    mapping(string => address[]) _versions;
}

contract RouterSlot {
    bytes32 constant internal _ROUTER = bytes32(uint256(keccak256("eip1967.router")) - 1);

    function _router() internal pure returns (Router storage sl) {
        bytes32 loc = _ROUTER;
        assembly {
            sl.slot := loc
        }
    }
}