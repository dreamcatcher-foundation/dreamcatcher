// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Auth } from "./Auth.sol";
import { EnumerableSet } from "../../import/openzeppelin/utils/structs/EnumerableSet.sol";

contract AuthSlot {
    bytes32 constant internal _AUTH_SLOT = bytes32(uint256(keccak256("eip1967.auth")) - 1);

    function _auth() internal pure returns (Auth storage layout) {
        bytes32 slot = _AUTH_SLOT;
        assembly {
            layout.slot := slot
        }
    }
}