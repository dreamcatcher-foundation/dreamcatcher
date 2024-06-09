// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

struct Router {
    mapping(string => address[]) _versions;
}

contract FacetVersionControlSlot {
    bytes32 constant internal _FACET_VERSION_CONTROL_SLOT = bytes32(uint256(keccak256("eip1967.router")) - 1);

    function _facetVersionControlSlot() internal pure returns (Router storage sl) {
        bytes32 slot = _ROUTER_SLOT;
        assembly {
            sl.slot := slot
        }
    }
}