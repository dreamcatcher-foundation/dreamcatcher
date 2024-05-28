// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "./TokenStorageSlot.sol";

contract TokenMetadataSocket is TokenStorageSlot {
    function _symbol() internal view returns (string memory) {
        return _tokenStorageSlot().symbol;
    }

    function _decimals() internal pure returns (uint8) {
        return 18;
    }
}