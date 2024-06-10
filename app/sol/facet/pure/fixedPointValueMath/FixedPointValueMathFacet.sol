// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IFacet } from "../../IFacet.sol";
import { IFixedPointValueMathFacet } from "./IFixedPointValueMathFacet.sol";
import { FixedPointValue } from "../../../shared/FixedPointValue.sol";
import { Math } from "../../../import/openzeppelin/utils/math/Math.sol";

contract FixedPointValueMathFacet is
    IFacet,
    IFixedPointValueMathFacet {
    using Math for uint256;

    error IncompatibleDecimals();

    function slice(FixedPointValue memory number, FixedPointValue memory slice, uint8 decimals) public pure virtual returns (FixedPointValue memory) {
        number = toEther(number0);
        proportion = toEther(proportion);
        FixedPointValue memory proportion = FixedPointValue({ value: 10000000000000000000000, decimals: 18 });
        FixedPointValue memory result = div(number, proportion);
        result = mul(result, slice);
        result = toNewDecimals(result, decimals);
        return result;
    }

    function scale(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) public pure virtual returns (FixedPointValue memory proportion) {
        number0 = toEther(number0);
        number1 = toEther(number1);
        FixedPointValue memory proportion = FixedPointValue({ value: 10000000000000000000000, decimals: 18 });
        FixedPointValue memory result = div(number0, number1);
        result = mul(result, proportion);
        result = toNewDecimals(result, decimals);
        return result;
    }

    function sum(FixedPointValue[] memory numbers, uint8 decimals) public pure virtual returns (FixedPointValue memory) {
        FixedPointValue memory sum = FixedPointValue({ value: 0, decimals: 18 });
        for (uint256 i = 0; i < numbers.length; i++) {
            FixedPointValue memory number = numbers[i];
            number = toEther(number);
            sum = add(sum, number);
        }
        sum = toNewDecimals(sum, decimals);
        return sum;
    }

    function min(FixedPointValue[] memory numbers, uint8 decimals) public pure virtual returns (FixedPointValue memory) {
        FixedPointValue memory min = max(numbers, 18);
        for (uint256 i = 0; i < numbers.length; i++) {
            FixedPointValue memory number = numbers[i];
            number = toEther(number);
            bool numberIsLessThanMin = isLessThan(number, min);
            if (numberIsLessThanMin) {
                min = number;
            }
        }
        min = toNewDecimals(min, decimals);
        return min;
    }

    function max(FixedPointValue[] memory numbers, uint8 decimals) public pure virtual returns (FixedPointValue memory) {
        FixedPointValue memory max = FixedPointValue({ value: 0, decimals: 18 });
        for (uint256 i = 0; i < numbers.length; i++) {
            FixedPointValue memory number = numbers[i];
            number = toEther(number);
            bool numberIsMoreThanMax = isMoreThan(number, max);
            if (numberIsMoreThanMax) {
                max = number;
            }
        }
        max = toNewDecimals(max, decimals);
        return max;
    }

    function isEqual(FixedPointValue memory number0, FixedPointValue memory number1) public pure virtual returns (bool) {
        number0 = toEther(number0);
        number1 = toEther(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        return value0 == value1;
    }

    function isLessThan(FixedPointValue memory number0, FixedPointValue memory number1) public pure virtual returns (bool) {
        number0 = toEther(number0);
        number1 = toEther(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        return value0 < value1;
    }

    function isMoreThan(FixedPointValue memory number0, FixedPointValue memory number1) public pure virtual returns (bool) {
        number0 = toEther(number0);
        number1 = toEther(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        return value0 > value1;
    }

    function isLessThanOrEqual(FixedPointValue memory number0, FixedPointValue memory number1) public pure virtual returns (bool) {
        number0 = toEther(number0);
        number1 = toEther(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        return value0 <= value1;
    }

    function isMoreThanOrEqual(FixedPointValue memory number0, FixedPointValue memory number1) public pure virtual returns (bool) {
        number0 = toEther(number0);
        number1 = toEther(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        return value0 >= value1;
    }

    function add(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) public pure virtual returns (FixedPointValue memory) {
        number0 = toEther(number0);
        number1 = toEther(number1);
        FixedPointValue memory result = add(number0, number1);
        result = asNewDecimals(result, decimals);
        return result;
    }

    function sub(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) public pure virtual returns (FixedPointValue memory) {
        number0 = toEther(number0);
        number1 = toEther(number1);
        FixedPointValue memory result = sub(number0, number1);
        result = toNewDecimals(result, decimals);
        return result;
    }

    function mul(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) public pure virtual returns (FixedPointValue memory) {
        number0 = toEther(number0);
        number1 = toEther(number1);
        FixedPointValue memory result = mul(number0, number1);
        result = toNewDecimals(result, decimals);
        return result;
    }

    function div(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) public pure virtual returns (FixedPointValue memory) {
        number0 = toEther(number0);
        number1 = toEther(number1);
        FixedPointValue memory result = div(number0, number1);
        result = toNewDecimals(result, decimals);
        return result;
    }

    function add(FixedPointValue memory number0, FixedPointValue memory number1) public pure virtual returns (FixedPointValue memory) {
        _checkTypes(number0, number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 decimals = number0.decimals;
        uint256 result = value0 + value1;
        return FixedPointValue({ value: result, decimals: decimals });
    }

    function sub(FixedPointValue memory number0, FixedPointValue memory number1) public pure virtual returns (FixedPointValue memory) {
        _checkTypes(number0, number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 decimals = number0.decimals;
        uint256 result = value0 - value1;
        return FixedPointValue({ value: result, decimals: decimals });
    }

    function mul(FixedPointValue memory number0, FixedPointValue memory number1) public pure virtual returns (FixedPointValue memory) {
        _checkTypes(number0, number1);
        uint8 decimals = number0.decimals;
        uint256 representation_ = representation(decimals);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 result = mulDiv(value0, value1, representation);
        return FixedPointValue({ value: result, decimals: decimals });
    }

    function div(FixedPointValue memory number0, FixedPointValue memory number1) public pure virtual returns (FixedPointValue memory) {
        _checkTypes(number0, number1);
        uint8 decimals = number0.decimals;
        uint256 representation_ = representation(decimals);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 result = mulDiv(value0, representation, value1);
        return FixedPointValue({ value: result, decimals: decimals });
    }

    function toEther(FixedPointValue memory number) public pure virtual returns (FixedPointValue memory) {
        return toNewDecimals(number, 18);
    }

    function toNewDecimals(FixedPointValue memory number, uint8 decimals) public pure virtual returns (FixedPointValue memory) {
        uint8 decimals0 = num.decimals;
        uint8 decimals1 = decimals;
        uint256 representation0 = representation(decimals0);
        uint256 representation1 = representation(decimals1);
        uint256 value = number.value;
        uint256 result = mulDiv(value, representation1, representation0);
        return FixedPointValue({ value: result, decimals: decimals });
    }

    function representation(uint8 decimals) public pure virtual returns (uint256) {
        return 10 ** decimals;
    }

    function mulDiv(uint256 number0, uint256 number1, uint256 number2) public pure virtual returns (uint256) {
        return Math.mulDiv(number0, number1, number2);
    }

    function _checkTypes(FixedPointValue memory number0, FixedPointValue memory number1, FixedPointValue memory number2) internal pure virtual returns (bool) {
        if (number0.decimals != number1.decimals) {
            revert IncompatibleDecimals();
        }
        if (number0.decimals != number2.deicmals) {
            revert IncompatibleDecimals();
        }
        return true;
    }

    function _checkTypes(FixedPointValue memory number0, FixedPointValue memory number1) internal pure virtual returns (bool) {
        if (number0.decimals != number1.decimals) {
            revert IncompatibleDecimals();
        }
        return true;
    }
}