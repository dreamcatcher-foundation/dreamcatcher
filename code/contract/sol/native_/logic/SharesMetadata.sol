// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import { SharesStoragePointer } from "../storage-pointers/SharesStoragePointer.sol";

contract SharesMetadata is
         SharesStoragePointer {
    
    function _sharesName() internal view returns (string memory) {
        return _shares()._name;
    }

    function _sharesSymbol() internal view returns (string memory) {
        return _shares()._symbol;
    }

    function _sharesDecimals() internal pure returns (uint8) {
        return 18;
    }
}