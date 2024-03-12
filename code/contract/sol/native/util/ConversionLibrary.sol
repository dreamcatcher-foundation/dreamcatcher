// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library ConversionLibrary {
    /**
    * Decimal Representation
    * ? => 64
     */
    function asNative(uint256 value, uint8 oldDecimals) internal pure returns (uint256 asNative) {
        return ((value * (10 ** 64) / (10 ** oldDecimals)) * (10 ** 64)) / (10 ** 64);
    }

    /**
    * Decimal Representation
    * 64 =? ?
     */
    function asNonNative(uint256 value, uint8 newDecimals) internal pure returns (uint256 asNonNative) {
        return ((value * (10 ** 64) / (10 ** 64)) * (10 ** newDecimals)) / (10 ** 64);
    }

    /**
    * Decimal Representation
    * ? => ?
     */
    function asNonNative(uint256 value, uint8 oldDecimals, uint8 newDecimals) internal pure returns (uint256 asNonNative) {
        asNonNative(asNative(value, oldDecimals), newDecimals); 
    }
}