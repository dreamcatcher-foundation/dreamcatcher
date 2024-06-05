// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct Node {
    address node;
    address owner;
}

struct AdminNodeSlotStorageLayout {
    mapping(string => Node) nodes;
}

contract AdminNodeSlot {
    bytes32 constant internal _NODE_ADMIN_SLOT = bytes32(
        uint256(
            keccak256(
                "eip1976.nodeAdmin"
            )
        ) - 1
    );

    function _children() internal pure returns (mapping(string => Node) storage storageLayout) {
        bytes32 location = _NODE_ADMIN_SLOT;
        assembly {
            storageLayout.slot := location
        }
    }
}