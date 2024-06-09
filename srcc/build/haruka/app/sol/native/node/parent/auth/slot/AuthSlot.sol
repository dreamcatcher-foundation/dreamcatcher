// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "../../../../../non-native/openzeppelin/utils/structs/EnumerableSet.sol";

contract AuthSlot {
    bytes32 constant internal _AUTH_SLOT = bytes32(uint256(keccak256("eip1967.auth")) - 1);

    function _membersOf() internal pure returns (mapping(bytes32 => EnumerableSet.AddressSet) storage sl) {
        bytes32 slot = _AUTH_SLOT;
        assembly {
            sl.slot := slot
        }
    }
}