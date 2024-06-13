// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Token } from "./Token.sol";

contract TokenSlot {
    bytes32 constant internal _TOKEN_SLOT = bytes32(uint256(keccak256("eip1967.tokenSlot")) - 1);

    function _token() internal pure returns (Token storage layout) {
        bytes32 slot = _TOKEN_SLOT;
        assembly {
            layout.slot := slot
        }
    }
}