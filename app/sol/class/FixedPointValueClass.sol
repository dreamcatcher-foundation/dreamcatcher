// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Math } from "../imports/openzeppelin/utils/math/Math.sol";

library FixedPointValueClass {
    using FixedPointValueClass for FixedPointValue;
    using Math for uint256;

    struct FixedPointValue {
        uint256 value;
        uint8 decimals;
    }

    function yield(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory basisPointsR18) {
        if (number0.value == 0) {
            return zeroYield();
        }
        if (number1.value == 0) {
            return zeroYield();
        }
        if (number1.value >= number0.value) {
            return fullYield();
        }
        return number1.scale(number0, 18);
    }

    function zeroYield() internal pure returns (FixedPointValue memory basisPointsR18) {
        return FixedPointValue({ value: 0, decimals: 18 });
    }

    function fullYield() internal pure returns (FixedPointValue memory basisPointsR18) {
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

    function scale(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) internal pure returns (FixedPointValue bpR) {
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

    function add(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory r) {
        return number0.add(number1).toDecimals(decimals);
    }

    function add(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory r18) {
        number0 = number0.toEther();
        number1 = number1.toEther();
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 result = value0 + value1;
        return FixedPointValue({ value: result, decimals: 18 });
    }

    function sub(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory r) {
        return number0.sub(number1).toDecimals(decimals);
    }

    function sub(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory r18) {
        number0 = number0.toEther();
        number1 = number1.toEther();
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 result = value0 - value1;
        return FixedPointValue({ value: result, decimals: 18 });
    }

    function mul(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory r) {
        return number0.mul(number1).toDecimals(decimals);
    }

    function mul(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory r18) {
        number0 = number0.toEther();
        number1 = number1.toEther();
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 result = value0.mulDiv(value1, _representation(18));
        return FixedPointValue({ value: result, decimals: 18 });
    }

    function div(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) internal pure returns (FixedPointValue memory r) {
        return number0.div(number1).toDecimals(decimals);
    }

    function div(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory r18) {
        number0 = number0.toEther();
        number1 = number1.toEther();
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 result = value0.mulDiv(_representation(18), value1);
        return FixedPointValue({ value: result, decimals: 18 });
    }

    function toEther(FixedPointValue memory number) internal pure returns (FixedPointValue memory r18) {
        return number.toDecimals(18);
    }

    function toDecimals(FixedPointValue memory number, uint8 decimals) internal pure returns (FixedPointValue memory r) {
        uint8 decimals0 = number.decimals;
        uint8 decimals1 = decimals;
        uint256 representation0 = _representation(decimals0);
        uint256 representation1 = _representation(decimals1);
        uint256 value = number.value;
        uint256 result = value.mulDiv(representation1, representation0);
        return FixedPointValue({ value: result, decimals: decimals });
    }

    function _representation(uint8 decimals) private pure returns (uint256) {
        return 10**decimals;
    }
}