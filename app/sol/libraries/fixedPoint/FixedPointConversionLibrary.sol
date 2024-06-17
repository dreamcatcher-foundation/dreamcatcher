// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { FixedPointValue } from "./FixedPointValue.sol";
import { Math } from "../../imports/openzeppelin/utils/math/Math.sol";

library FixedPointConversionLibrary {
    using Math for uint256;

    function convertToEtherDecimals(FixedPointValue memory number) internal pure returns (FixedPointValue memory) {
        return convertToNewDecimals(number, 18);
    }

    function convertToNewDecimals(FixedPointValue memory number, uint8 decimals) internal pure returns (FixedPointValue memory) {
        uint8 decimals0 = number.decimals;
        uint8 decimals1 = decimals;
        uint256 representation0 = _representation(decimals0);
        uint256 representation1 = _representation(decimals1);
        uint256 value = number.value;
        uint256 result = _mulDiv(value, representation1, representation0);
        return FixedPointValue({ value: result, decimals: decimals });
    }

    function _mulDiv(uint256 number0, uint256 number1, uint256 number2) private pure returns (uint256) {
        return number0.mulDiv(number1, number2);
    }

    function _representation(uint8 decimals) private pure returns (uint256) {
        return 10**decimals;
    }
}