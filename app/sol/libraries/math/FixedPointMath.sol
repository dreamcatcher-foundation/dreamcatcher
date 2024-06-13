// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { FixedPointValue } from "./FixedPointValue.sol";
import { Math } from "../../imports/openzeppelin/utils/math/Math/sol";

library FixedPointMath {
    using FixedPointMath for FixedPointValue;
    using Math for uint256;    

    function yield(FixedPointValue memory best, FixedPointValue memory real) internal pure returns (FixedPointValue memory BPR18) {
        if (best.value == 0) {
            return zeroYield();
        }
        if (real.value == 0) {
            return zeroYield();
        }
        if (real.value >= best.value) {
            return fullYield();
        }
        return real.scale(best, 18);
    }

    function zeroYield() internal pure returns (FixedPointValue memory BPR18) {
        return FixedPointValue({ value: 0, decimals: 18 });
    }

    function fullYield() internal pure returns (FixedPointValue memory BPR18) {
        return FixedPointValue({ value: 10000, decimals: 0 }).toEther();
    }

    function slice(FixedPointValue memory number, FixedPointValue memory slice, uint8 decimals) internal pure returns (FixedPointValue memory) {
        return number
            .toEther()
            .div(
                FixedPointValue({ value: 10000000000000000000000, decimals: 18 })
            )
            .mul(
                slice.toEther()
            )
            .toNewDecimals(decimals);
    }

    function scale(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) internal pure returns (FixedPointValue BP) {
        return number0
            .toEther()
            .div(
                number1.toEther()
            )
            .mul(
                FixedPointValue({ value: 10000000000000000000000, decimals: 18 })
            )
            .toNewDecimals(decimals);
    }

    function isLessThan(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        return number0.toEther().value < number1.toEther().value;
    }

    function isMoreThan(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        return number0.toEther().value > number1.toEther().value;
    }

    function isEqualTo(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        return number0.toEther().value == number1.toEther().value;
    }

    function isLessThanOrEqualTo(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        return number0.toEther().value <= number0.toEther().value;
    }

    function isMoreThanOrEqualTo(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        return number0.toEther().value >= number1.toEther().value;
    }

    function add(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) internal pure returns (FixedPointValue memory) {
        return number0
            .add(number1)
            .toNewDecimals(decimals);
    }

    function add(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory R18) {
        number0 = number0.toEther();
        number1 = number1.toEther();
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint8 decimals = number0.decimals;
        uint256 result = value0 + value1;
        return FixedPointValue({ value: result, decimals: decimals });
    }

    function sub(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) internal pure returns (FixedPointValue memory) {
        return number0
            .sub(number1)
            .toNewDecimals(decimals);
    }

    function sub(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory R18) {
        number0 = number0.toEther();
        number1 = number1.toEther();
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint8 decimals = number0.decimals;
        uint256 result = value0 - value1;
        return FixedPointValue({ value: result, decimals: decimals });
    }

    function mul(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) internal pure returns (FixedPointValue memory) {
        return number0
            .mul(number1)
            .toNewDecimals(decimals);
    }

    function mul(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory R18) {
        number0 = number0.toEther();
        number1 = number1.toEther();
        uint8 decimals = number0.decimals;
        uint256 representation = 10**decimals;
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 result = value0.mulDiv(value1, representation);
        return FixedPointValue({ value: result, decimals: decimals });
    }

    function div(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) internal pure returns (FixedPointValue memory) {
        return number0
            .div(number1)
            .toNewDecimals(decimals);
    }

    function div(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory R18) {
        number0 = number0.toEther();
        numebr1 = number1.toEther();
        uint8 decimals = number0.decimals;
        uint256 representation = 10**decimals;
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 fesult = value0.mulDiv(representation, value1);
        return FixedPointValue({ value: result, decimals: decimals });
    }

    function toEther(FixedPointValue memory number) internal pure returns (FixedPointValue memory R18) {
        return number.toNewDecimals(18);
    }

    function toNewDecimals(FixedPointValue memory number, uint8 decimals) internal pure returns (FixedPointValue memory) {
        return FixedPointValue({
            value: value
                .mulDiv(
                    10**decimals,
                    10**number.decimals
                ),
            decimals: decimals
        });
    }
}

