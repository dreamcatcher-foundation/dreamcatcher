// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Math } from "../import/openzeppelin/utils/math/Math.sol";

library FixedPointValueLib {
    using Math for uint256;

    struct FixedPointValue {
        uint256 value;
        uint8 decimals;
    }

    function calculateYield(FixedPointValue memory best, FixedPointValue memory real) internal pure returns (FixedPointValue memory asEtherBasisPoints) {
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

    function zeroYield() internal pure returns (FixedPointValue memory asEtherBasisPoints) {
        return FixedPointValue({ value: 0, decimals: 18 });
    }

    function fullYield() internal pure returns (FixedPointValue memory asEtherBasisPoints) {
        return FixedPointValue({ value: 10000, decimals: 0 }).toEther();
    }

    function slice(FixedPointValue memory number, FixedPointValue memory slice, uint8 decimals) internal pure returns (FixedPointValue memory asNewDecimals) {
        number = number.toEther();
        slice = slice.toEther();
        FixedPointValue memory proportion = FixedPointValue({ value: 10000000000000000000000, decimals: 18 });
        FixedPointValue memory result = div(number, proportion);
        result = mul(result, slice);
        result = toNewDecimals(result, decimals);
        return result;
    }

    function scale(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) internal pure returns (FixedPointValue memory asNewDecimalsBasisPoints) {
        number0 = toEther(number0);
        number1 = toEther(number1);
        FixedPointValue memory proportion = FixedPointValue({ value: 10000000000000000000000, decimals: 18 });
        FixedPointValue memory result = div(number0, number1);
        result = mul(result, proportion);
        result = toNewDecimals(result, decimals);
        return result;
    }

    function isEqualTo(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        number0 = toEther(number0);
        number1 = toEther(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        return value0 == value1;
    }

    function isLessThan(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        number0 = toEther(number0);
        number1 = toEther(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        return value0 < value1;
    }

    function isMoreThan(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        number0 = toEther(number0);
        number1 = toEther(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        return value0 > value1;
    }

    function isLessThanOrEqualTo(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        number0 = toEther(number0);
        number1 = toEther(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        return value0 <= value1;
    }

    function isMoreThanOrEqualTo(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        number0 = toEther(number0);
        number1 = toEther(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        return value0 >= value1;
    }    

    function add(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) internal pure returns (FixedPointValue memory asNewDecimals) {
        number0 = toEther(number0);
        number1 = toEther(number1);
        FixedPointValue memory result = add(number0, number1);
        return result.toNewDecimals(decimals);
    }

    function sub(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) internal pure returns (FixedPointValue memory asNewDecimals) {
        number0 = toEther(number0);
        number1 = toEther(number1);
        FixedPointValue memory result = sub(number0, number1);
        result = toNewDecimals(result, decimals);
        return result;
    }

    function mul(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) internal pure returns (FixedPointValue memory asNewDecimals) {
        number0 = toEther(number0);
        number1 = toEther(number1);
        FixedPointValue memory result = mul(number0, number1);
        result = toNewDecimals(result, decimals);
        return result;
    }

    function div(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) internal pure returns (FixedPointValue memory asNewDecimals) {
        number0 = toEther(number0);
        number1 = toEther(number1);
        FixedPointValue memory result = div(number0, number1);
        result = toNewDecimals(result, decimals);
        return result;
    }

    function add(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory asEther) {
        number0 = number0.toEther();
        number1 = number1.toEther();
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint8 decimals = number0.decimals;
        uint256 result = value0 + value1;
        return FixedPointValue({ value: result, decimals: decimals });
    }

    function sub(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory asEther) {
        number0 = number0.toEther();
        number1 = number1.toEther();
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint8 decimals = number0.decimals;
        uint256 result = value0 - value1;
        return FixedPointValue({ value: result, decimals: decimals });
    }

    function mul(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory asEther) {
        number0 = number0.toEther();
        number1 = number1.toEther();
        uint8 decimals = number0.decimals;
        uint256 representation = _representation(decimals);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 result = _mulDiv(value0, value1, representation);
        return FixedPointValue({ value: result, decimals: decimals });
    }

    function div(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory asEther) {
        number0 = number0.toEther();
        number1 = number1.toEther();
        uint8 decimals = number0.decimals;
        uint256 representation = _representation(decimals);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 result = _mulDiv(value0, representation, value1);
        return FixedPointValue({ value: result, decimals: decimals });
    }

    function toEther(FixedPointValue memory number) internal pure returns (FixedPointValue memory asEther) {
        return toNewDecimals(number, 18);
    }

    function toNewDecimals(FixedPointValue memory number, uint8 decimals) internal pure returns (FixedPointValue memory asNewDecimals) {
        uint8 decimals0 = number.decimals;
        uint8 decimals1 = decimals;
        uint256 representation0 = _representation(decimals0);
        uint256 representation1 = _representation(decimals1);
        uint256 value = number.value;
        uint256 result = _mulDiv(value, representation1, representation0);
        return FixedPointValue({ value: result, decimals: decimals });
    }

    function _representation(uint8 decimals) private pure returns (uint256) {
        return 10 ** decimals;
    }

    function _mulDiv(uint256 number0, uint256 number1, uint256 number2) private pure returns (uint256) {
        return number0.mulDiv(number1, number2);
    }
}