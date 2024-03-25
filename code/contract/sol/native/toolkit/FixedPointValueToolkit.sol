// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import '../../non-native/openzeppelin/utils/math/Math.sol';

struct FixedPointValue {
    uint256 value;
    uint8 decimals;
}

function _getSliceUsingFixedPointValueToolkit(FixedPointValue memory number, FixedPointValue memory proportion, uint8 asDecimals) pure returns (FixedPointValue memory) {
    number = _getAsEtherUsingFixedPointValueToolkit(number);
    proportion = _getAsEtherUsingFixedPointValueToolkit(proportion);
    FixedPointValue memory scale = FixedPointValue({value: 10000_0000_0000_0000_0000_00, decimals: 18});
    FixedPointValue memory result = _divUsingFixedPointValueToolkit(number, proportion, 18);
    result = _mulUsingFixedPointValueToolkit(result, scale, asDecimals);
    return result;
}

function _getScaleUsingFixedPointValueToolkit(FixedPointValue memory number0, FixedPointValue memory number1, uint8 toDecimals) pure returns (FixedPointValue memory proportion) {
    number0 = _getAsEtherUsingFixedPointValueToolkit(number0);
    number1 = _getAsEtherUsingFixedPointValueToolkit(number1);
    FixedPointValue memory scale = FixedPointValue({value: 10000_0000_0000_0000_0000_00, decimals: 18});
    FixedPointValue memory result = _divUsingFixedPointValueToolkit(number0, number1, 18);
    result = _mulUsingFixedPointValueToolkit(result, scale, toDecimals);
    result = _getAsNewDecimalsUsingFixedPointValueToolkit(result, toDecimals);
    return result;
}

function _getSumUsingFixedPointValueToolkit(FixedPointValue[] memory numbers, uint8 toDecimals) pure returns (FixedPointValue memory) {
    FixedPointValue memory sum = FixedPointValue({value: 0, decimals: 18});
    for (uint256 i = 0; i < numbers.length; i++) {
        FixedPointValue memory number = numbers[i];
        number = _getAsEtherUsingFixedPointValueToolkit(number);
        sum = _addUsingFixedPointValueToolkit(sum, number, 18);
    }
    sum = _getAsNewDecimalsUsingFixedPointValueToolkit(sum, toDecimals);
    return sum;
}

function _getMinUsingFixedPointValueToolkit(FixedPointValue[] memory numbers, uint8 toDecimals) pure returns (FixedPointValue memory) {
    FixedPointValue memory min = _getMaxUsingFixedPointValueToolkit(numbers, 18);
    for (uint256 i = 0; i < numbers.length; i++) {
        FixedPointValue memory number = numbers[i];
        number = _getAsEtherUsingFixedPointValueToolkit(number);
        bool numberIsLowerThanCurrentMin = _checkIfLessThanUsingFixedPointValueToolkit(number, min);
        if (numberIsLowerThanCurrentMin) {
            min = number;
        }
    }
    min = _getAsNewDecimalsUsingFixedPointValueToolkit(min, toDecimals);
    return min;
}

function _getMaxUsingFixedPointValueToolkit(FixedPointValue[] memory numbers, uint8 toDecimals) pure returns (FixedPointValue memory) {
    FixedPointValue memory max = FixedPointValue({value: 0, decimals: 18});
    for (uint256 i = 0; i < numbers.length; i++) {
        FixedPointValue memory number = numbers[i];
        number = _getAsEtherUsingFixedPointValueToolkit(number);
        bool numberIsHigherThanCurrentMax = _checkIfMoreThanUsingFixedPointValueToolkit(number, max);
        if (numberIsHigherThanCurrentMax) {
            max = number;
        }
    }
    max = _getAsNewDecimalsUsingFixedPointValueToolkit(max, toDecimals);
    return max;
}

function _checkIfEqualUsingFixedPointValueToolkit(FixedPointValue memory number0, FixedPointValue memory number1) pure returns (bool) {
    number0 = _getAsEtherUsingFixedPointValueToolkit(number0);
    number1 = _getAsEtherUsingFixedPointValueToolkit(number1);
    uint256 value0 = number0.value;
    uint256 value1 = number1.value;
    return value0 == value1;
}

function _checkIfLessThanUsingFixedPointValueToolkit(FixedPointValue memory number0, FixedPointValue memory number1) pure returns (bool) {
    number0 = _getAsEtherUsingFixedPointValueToolkit(number0);
    number1 = _getAsEtherUsingFixedPointValueToolkit(number1);
    uint256 value0 = number0.value;
    uint256 value1 = number1.value;
    return value0 < value1;
}

function _checkIfMoreThanUsingFixedPointValueToolkit(FixedPointValue memory number0, FixedPointValue memory number1) pure returns (bool) {
    number0 = _getAsEtherUsingFixedPointValueToolkit(number0);
    number1 = _getAsEtherUsingFixedPointValueToolkit(number1);
    uint256 value0 = number0.value;
    uint256 value1 = number1.value;
    return value0 > value1;
}

function _checkIfLessThanOrEqualToUsingFixedPointValueToolkit(FixedPointValue memory number0, FixedPointValue memory number1) pure returns (bool) {
    number0 = _getAsEtherUsingFixedPointValueToolkit(number0);
    number1 = _getAsEtherUsingFixedPointValueToolkit(number1);
    uint256 value0 = number0.value;
    uint256 value1 = number1.value;
    return value0 <= value1;
}

function _checkIfMoreThanOrEqualToUsingFixedPointValueToolkit(FixedPointValue memory number0, FixedPointValue memory number1) pure returns (bool) {
    number0 = _getAsEtherUsingFixedPointValueToolkit(number0);
    number1 = _getAsEtherUsingFixedPointValueToolkit(number1);
    uint256 value0 = number0.value;
    uint256 value1 = number1.value;
    return value0 >= value1;
}

function _addUsingFixedPointValueToolkit(FixedPointValue memory number0, FixedPointValue memory number1, uint8 toDecimals) pure returns (FixedPointValue memory) {
    number0 = _getAsEtherUsingFixedPointValueToolkit(number0);
    number1 = _getAsEtherUsingFixedPointValueToolkit(number1);
    uint256 value0 = number0.value;
    uint256 value1 = number1.value;
    uint256 addResult = value0 + value1;
    FixedPointValue memory result = FixedPointValue({value: addResult, decimals: 18});
    result = _getAsNewDecimalsUsingFixedPointValueToolkit(result, toDecimals);
    return result;
}

function _subUsingFixedPointValueToolkit(FixedPointValue memory number0, FixedPointValue memory number1, uint8 toDecimals) pure returns (FixedPointValue memory) {
    number0 = _getAsEtherUsingFixedPointValueToolkit(number0);
    number1 = _getAsEtherUsingFixedPointValueToolkit(number1);
    uint256 value0 = number0.value;
    uint256 value1 = number1.value;
    uint256 subResult = value0 - value1;
    FixedPointValue memory result = FixedPointValue({value: subResult, decimals: 18});
    result = _getAsNewDecimalsUsingFixedPointValueToolkit(result, toDecimals);
    return result;
}

function _mulUsingFixedPointValueToolkit(FixedPointValue memory number0, FixedPointValue memory number1, uint8 toDecimals) pure returns (FixedPointValue memory) {
    number0 = _getAsEtherUsingFixedPointValueToolkit(number0);
    number1 = _getAsEtherUsingFixedPointValueToolkit(number1);
    uint256 value0 = number0.value;
    uint256 value1 = number1.value;
    uint256 representation = 10**18;
    uint256 mulDivResult = Math.mulDiv(value0, value1, representation);
    FixedPointValue memory result = FixedPointValue({value: mulDivResult, decimals: 18});
    result = _getAsNewDecimalsUsingFixedPointValueToolkit(result, toDecimals);
    return result;
}

function _divUsingFixedPointValueToolkit(FixedPointValue memory number0, FixedPointValue memory number1, uint8 toDecimals) pure returns (FixedPointValue memory) {
    number0 = _getAsEtherUsingFixedPointValueToolkit(number0);
    number1 = _getAsEtherUsingFixedPointValueToolkit(number1);
    uint256 value0 = number0.value;
    uint256 value1 = number1.value;
    uint256 representation = 10**18;
    uint256 mulDivResult = Math.mulDiv(value0, representation, value1);
    FixedPointValue memory result = FixedPointValue({value: mulDivResult, decimals: 18});
    result = _getAsNewDecimalsUsingFixedPointValueToolkit(result, toDecimals);
    return result;
}

function _getAsEtherUsingFixedPointValueToolkit(FixedPointValue memory number) pure returns (FixedPointValue memory) {
    return _getAsNewDecimalsUsingFixedPointValueToolkit(number, 18);
}

function _getAsNewDecimalsUsingFixedPointValueToolkit(FixedPointValue memory number, uint8 toDecimals) pure returns (FixedPointValue memory) {
    uint8 decimals0 = number.decimals;
    uint8 decimals1 = toDecimals;
    uint256 representation0 = 10**decimals0;
    uint256 representation1 = 10**decimals1;
    uint256 value = number.value;
    uint256 result = Math.mulDiv(value, representation1, representation0);
    return FixedPointValue({value: result, decimals: decimals1});
}