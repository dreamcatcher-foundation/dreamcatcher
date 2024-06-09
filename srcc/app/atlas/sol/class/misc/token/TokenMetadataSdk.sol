// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { TokenSlot } from "./TokenSlot.sol";

contract TokenMetadataSdk is TokenSlot {
    function _symbol() internal view returns (string memory) {
        return _token().symbol;
    }

    function _decimals() internal pure returns (uint8) {
        return 18;
    }
}