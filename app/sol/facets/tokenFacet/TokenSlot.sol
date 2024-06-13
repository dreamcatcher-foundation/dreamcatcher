// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { TokenSl } from "./TokenSl.sol";

contract TokenSlot {
    bytes32 constant internal _TOKEN_SLOT = bytes32(uint256(keccak256("eip1967.token")) - 1);

    function _tokenSl() internal pure returns (TokenSl storage sl) {
        bytes32 slot = _TOKEN_SLOT;

        assembly {
            sl.slot := slot
        }
    }
}