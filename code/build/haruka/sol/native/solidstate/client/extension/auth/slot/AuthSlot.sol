// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "../../../../../../non-native/openzeppelin/utils/structs/EnumerableSet.sol";

contract AuthSlot {
    bytes32 constant internal AUTH_SLOT = bytes32(uint256(keccak256("eip1967.auth")) - 1);

    function _membersOf() internal pure returns (mapping(bytes32 => EnumerableSet.AddressSet) storage storageLayout) {
        bytes32 location = AUTH_SLOT;
        assembly {
            storageLayout.slot := location
        }
    }
}