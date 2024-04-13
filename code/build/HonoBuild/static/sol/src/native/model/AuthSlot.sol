// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "../../non-native/openzeppelin/utils/structs/EnumerableSet.sol";

struct Auth {
    mapping(bytes32 => EnumerableSet.AddressSet) _members;
}

contract AuthSlot {
    bytes32 constant internal _AUTH = bytes32(uint256(keccak256("eip1967.auth")) - 1);

    function _auth() internal pure returns (Auth storage sl) {
        bytes32 loc = _AUTH;
        assembly {
            sl.slot := loc
        }
    }
}