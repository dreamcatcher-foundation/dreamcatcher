// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

contract SharedFragmentsStoragePointer {
    bytes32 constant internal _SHARED_FRAGMENTS_STORAGE_POINTER = bytes32(uint256(keccak256('eip1967.mods')) - 1);

    function _sharedFragmentsStoragePointer() internal pure returns (mapping(bytes32 => address) storage slot) {
        bytes32 location = _SHARED_FRAGMENTS_STORAGE_POINTER;
        assembly {
            slot.slot := location
        }
    }
}