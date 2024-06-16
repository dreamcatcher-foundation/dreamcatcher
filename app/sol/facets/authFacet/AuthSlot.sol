// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { AuthSl } from "./AuthSl.sol";

contract AuthSlot {
    bytes32 constant internal _AUTH_SLOT = bytes32(uint256(keccak256("eip1967.auth")) - 1);

    function _authSl() internal pure returns (AuthSl storage sl) {
        bytes32 slot = _AUTH_SLOT;

        assembly {
            sl.slot := slot
        }
    }
}