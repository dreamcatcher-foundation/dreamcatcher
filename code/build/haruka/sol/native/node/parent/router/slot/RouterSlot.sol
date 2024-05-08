// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

struct Facet {
    address component;
    string name;
    address committer;
    bytes4[] selectors;
    uint256 commitTimestamp;
    uint256 versionId;
}

contract RouterSlot {
    bytes32 constant internal _ROUTER_SLOT = bytes32(uint256(keccak256("eip1967.router")) - 1);

    function _versionsOf() internal pure returns (mapping(bytes32 => address[]) storage sl) {
        bytes32 slot = _ROUTER_SLOT;
        assembly {
            sl.slot := slot
        }
    }
}