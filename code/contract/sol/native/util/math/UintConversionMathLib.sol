// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library UintConversionMathLib {
    function asR64(uint256 value, uint8 oldDecimals) internal pure returns (uint256 r64) {
        _onlySupportedDecimalRepresentation(oldDecimals);
        return ((value * (10 ** 64) / (10 ** oldDecimals)) * (10 ** 64)) / (10 ** 64);
    }

    function asR(uint256 valueR64, uint8 newDecimals) internal pure returns (uint256 r) {
        _onlySupportedDecimalRepresentation(newDecimals);
        return ((valueR64 * (10 ** 64) / (10 ** 64)) * (10 ** newDecimals)) / (10 ** 64);
    }

    struct ConversionPayload {
        uint256 value,
        uint8 oldDecimals,
        uint8 newDecimals
    }

    function asNew(ConversionPayload payload) internal pure returns (uint256 r) {
        _onlySupportedDecimalRepresentation(payload.oldDecimals);
        _onlySupportedDecimalRepresentation(payload.newDecimals);
        uint256 r64 = asR64(payload.value, payload.oldDecimals);
        return asR(r64, payload.newDecimals);
    }

    function _onlySupportedDecimalRepresentation(uint8 decimals) private pure returns (bool) {
        require(decimals <= 64, "UintConversionLib: does not support decimals greater than 64");
        return true;
    }
}