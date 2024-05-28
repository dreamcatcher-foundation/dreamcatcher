// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "../../../../import/openzeppelin/utils/structs/EnumerableSet.sol";

struct AuthStorageLayout {
    mapping(string => EnumerableSet.AddressSet) membersOf;
}

contract AuthStorageSlot {
    bytes32 constant internal _AUTH_SLOT_STORAGE_LOCATION = bytes32(
        uint256(
            keccak256(
                "eip1967.authStorage"
            )
        ) - 1
    );

    function _authStorageSlot() internal pure returns (AuthStorageLayout storage storageLayout) {
        bytes32 location = _AUTH_SLOT_STORAGE_LOCATION;
        assembly {
            storageLayout.slot := location
        }
    }
}