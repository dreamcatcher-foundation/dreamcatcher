// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library UintConversionMathLib {

    /**
     * @dev Converts a uint value from a specified decimal representation to a 64 decimal representation.
     * @param value The uint value to convert.
     * @param oldDecimals The number of decimal places in the original representation.
     * @return r64 The value converted to a 64 decimal representation.
     */
    function asR64(uint value, uint8 oldDecimals) internal pure returns (uint r64) {
        _onlySupportedDecimalRepresentation(oldDecimals);
        return ((value * (10 ** 64) / (10 ** oldDecimals)) * (10 ** 64)) / (10 ** 64);
    }

    /**
     * @dev Converts a uint value from a 64 decimal representation to a specified decimal representation.
     * @param value The uint value to convert.
     * @param newDecimals The number of decimal places in the target representation.
     * @return r The value converted to the target decimal representation.
     * @notice This function will cause precision loss of value when the target decimal representation is lower than 64.
     */
    function asR(uint value, uint8 newDecimals) internal pure returns (uint r) {
        _onlySupportedDecimalRepresentation(newDecimals);
        return ((value * (10 ** 64) / (10 ** 64)) * (10 ** newDecimals)) / (10 ** 64);
    }

    struct ConversionPayload {
        uint value,
        uint8 oldDecimals,
        uint8 newDecimals
    }

    /**
     * @dev Converts a uint value from one decimal representation to another.
     * @param payload The conversion payload containing the value and both the original and target decimal representations.
     * @return r The value converted to the target decimal representation.
     */
    function asNew(ConversionPayload payload) internal pure returns (uint r) {
        _onlySupportedDecimalRepresentation(payload.oldDecimals);
        _onlySupportedDecimalRepresentation(payload.newDecimals);
        uint r64 = asR64(payload.value, payload.oldDecimals);
        return asR(r64, payload.newDecimals);
    }

    /**
     * @dev Checks if the provided number of decimals is supported.
     * @param decimals The number of decimal places to check.
     * @return A boolean indicating whether the provided number of decimals is supported.
     * @notice The protocol does not support decimals greater than 64.
     */
    function _onlySupportedDecimalRepresentation(uint8 decimals) private pure returns (bool) {
        require(decimals <= 64, "UintConversionLib: does not support decimals greater than 64");
        return true;
    }
}