// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { FixedPointValue } from "./FixedPointValue.sol";
import { FixedPointConversion } from "./FixedPointConversion.sol";

library FixedPointOperator {
    function isLessThan(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        return FixedPointConversion.toEther(number0).value < FixedPointConversion.toEther(number1).value;
    }

    function isMoreThan(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        return FixedPointConversion.toEther(number0).value > FixedPointConversion.toEther(number1).value;
    }

    function isEqualTo(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        return FixedPointConversion.toEther(number0).value == FixedPointConversion.toEther(number1).value;
    }

    function isLessThanOrEqualTo(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        return FixedPointConversion.toEther(number0).value <= FixedPointConversion.toEther(number1).value;
    }

    function isMoreThanOrEqualTo(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        return FixedPointConversion.toEther(number0).value >= FixedPointConversion.toEther(number1).value;
    }
}