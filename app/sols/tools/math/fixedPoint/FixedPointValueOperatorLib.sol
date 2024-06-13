// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { FixedPointValue } from "./FixedPointValue.sol";
import { FixedPointValueConversionLib } from "./FixedPointValueConversionLib.sol";

library FixedPointValueOperatorLib {
    function isLessThan(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        return FixedPointValueConversionLib.toEther(number0).value < FixedPointValueConversionLib.toEther(number1).value;
    }

    function isMoreThan(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        return FixedPointValueConversionLib.toEther(number0).value > FixedPointValueConversionLib.toEther(number1).value;
    }

    function isEqualTo(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        return FixedPointValueConversionLib.toEther(number0).value == FixedPointValueConversionLib.toEther(number1).value;
    }

    function isLessThanOrEqualTo(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        return FixedPointValueConversionLib.toEther(number0).value <= FixedPointValueConversionLib.toEther(number1).value;
    }

    function isMoreThanOrEqualTo(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        return FixedPointValueConversionLib.toEther(number0).value >= FixedPointValueConversionLib.toEther(number1).value;
    }
}