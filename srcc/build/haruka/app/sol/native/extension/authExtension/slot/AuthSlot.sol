// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "../../../../nonNative/openzeppelin/utils/structs/EnumerableSet.sol";

struct Auth {
    mapping(bytes32 => EnumerableSet.AddressSet) members;
}

contract AuthSlot {
    bytes32 constant internal _AUTH_SLOT = bytes32(uint256(keccak256("eip1967.authSlot")) - 1);

    function _authSlot() internal pure returns (Auth storage sl) {
        bytes32 loc = _AUTH_SLOT;
        assembly {
            sl.slot := loc
        }
    }
}