// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { FixedPointValue } from "./FixedPointValue.sol";
import { FixedPointConversionLibrary } from "./FixedPointConversionLibrary.sol";
import { Math } from "../../imports/openzeppelin/utils/math/Math.sol";

library FixedPointArithmeticLibrary {
    using FixedPointConversionLibrary for FixedPointValue;
    using Math for uint256;

    function add(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory R18) {
        number0 = FixedPointConversionLibrary.convertToEtherDecimals(number0);
        number1 = FixedPointConversionLibrary.convertToEtherDecimals(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 result = value0 + value1;
        return FixedPointValue({ value: result, decimals: 18 });
    }

    function sub(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory R18) {
        number0 = FixedPointConversionLibrary.convertToEtherDecimals(number0);
        number1 = FixedPointConversionLibrary.convertToEtherDecimals(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 result = value0 - value1;
        return FixedPointValue({ value: result, decimals: 18 });
    }

    function mul(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory R18) {
        number0 = number0.convertToEtherDecimals();
        number1 = number1.convertToEtherDecimals();
        uint8 decimals = number0.decimals;
        uint256 representation = _representation(decimals);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 result = _mulDiv(value0, value1, representation);
        return FixedPointValue({ value: result, decimals: decimals });
    }

    function div(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory R18) {
        number0 = number0.convertToEtherDecimals();
        number1 = number1.convertToEtherDecimals();
        uint8 decimals = number0.decimals;
        uint256 representation = _representation(decimals);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 result = _mulDiv(value0, representation, value1);
        return FixedPointValue({ value: result, decimals: decimals });
    }

    function _mulDiv(uint256 number0, uint256 number1, uint256 number2) private pure returns (uint256) {
        return number0.mulDiv(number1, number2);
    }

    function _representation(uint8 decimals) private pure returns (uint256) {
        return 10**decimals;
    }
}