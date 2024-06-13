// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct Child {
    address sentinel;
}

contract ChildSlot {
    bytes32 constant internal _CHILD_SLOT = bytes32(uint256(keccak256("eip1976.child")) - 1);

    function _child() internal view returns (ChildLib.Child storage storageLayout) {

    }

    _child().parent();
}