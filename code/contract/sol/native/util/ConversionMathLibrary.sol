// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library ConversionMathLibrary {
    function fromEtherToNonNativeDecimals(uint256 number, uint8 newDecimals) internal pure returns (uint256) {
        return ((number * (10 ** 18) / (10 ** 18)) * (10 ** newDecimals)) / (10 ** 18);
    }

    function fromNonNativeDecimalsToEther(uint256 number, uint8 oldDecimals) internal pure returns (uint256) {
        return ((number * (10 ** 18) / (10 ** oldDecimals)) * (10 ** 18)) / (10 ** 18);
    }

    function fromNonNativeDecimalsToAnyDecimals(uint256 number, uint8 oldDecimals, uint8 newDecimals) internal pure returns (uint256) {
        return fromEtherToNonNativeDecimals(fromNonNativeDecimalsToEther(number, oldDecimals), newDecimals);
    }
}