// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import '../../non-native/openzeppelin/utils/math/Math.sol';

struct FixedPointValue {
    uint256 value;
    uint8 decimals;
}

function _slice(FixedPointValue memory number, FixedPointValue memory proportion, uint8 asDecimals) pure returns (FixedPointValue memory) {
    number = _asEther(number);
    proportion = _asEther(proportion);
    FixedPointValue memory scale = FixedPointValue({value: 10000_0000_0000_0000_0000_00, decimals: 18});
    FixedPointValue memory result = _div(number, proportion);
    result = _mul(result, scale);
    result = _asNewDecimals(result, asDecimals);
    return result;
}

function _scale(FixedPointValue memory number0, FixedPointValue memory number1, uint8 asDecimals) pure returns (FixedPointValue memory proportion) {
    number0 = _asEther(number0);
    number1 = _asEther(number1);
    FixedPointValue memory scale = FixedPointValue({value: 10000_0000_0000_0000_0000_00, decimals: 18});
    FixedPointValue memory result = _div(number0, number1);
    result = _mul(result, scale);
    result = _asNewDecimals(result, asDecimals);
    return result;
}

function _sum(FixedPointValue[] memory numbers, uint8 asDecimals) pure returns (FixedPointValue memory) {
    FixedPointValue memory sum = FixedPointValue({value: 0, decimals: 18});
    for (uint256 i = 0; i < numbers.length; i++) {
        FixedPointValue memory number = numbers[i];
        number = _asEther(number);
        sum = _add(sum, number);
    }
    sum = _asNewDecimals(sum, asDecimals);
    return sum;
}

function _min(FixedPointValue[] memory numbers, uint8 asDecimals) pure returns (FixedPointValue memory) {
    FixedPointValue memory min = max(numbers, 18);
    for (uint256 i = 0; i < numbers.length; i++) {
        FixedPointValue memory number = numbers[i];
        number = _asEther(number);
        bool numberIsLowerThanCurrentMin = _isLessThan(number, min);
        if (numberIsLowerThanCurrentMin) {
            min = number;
        }
    }
    min = _asNewDecimals(min, asDecimals);
    return min;
}

function _max(FixedPointValue[] memory numbers, uint8 asDecimals) pure returns (FixedPointValue memory) {
    FixedPointValue memory max = FixedPointValue({value: 0, decimals: 18});
    for (uint256 i = 0; i < numbers.length; i++) {
        FixedPointValue memory number = numbers[i];
        number = _asEther(number);
        bool numberIsHigherThanCurrentMax = _isMoreThan(number, max);
        if (numberIsHigherThanCurrentMax) {
            max = number;
        }
    }
    max = _asNewDecimals(max, asDecimals);
    return max;
}

function _isEqual(FixedPointValue memory number0, FixedPointValue memory number1) pure returns (bool) {
    number0 = _asEther(number0);
    number1 = _asEther(number1);
    uint256 value0 = number0.value;
    uint256 value1 = number1.value;
    return value0 == value1;
}

function _isLessThan(FixedPointValue memory number0, FixedPointValue memory number1) pure returns (bool) {
    number0 = _asEther(number0);
    number1 = _asEther(number1);
    uint256 value0 = number0.value;
    uint256 value1 = number1.value;
    return value0 < value1;
}

function _isMoreThan(FixedPointValue memory number0, FixedPointValue memory number1) pure returns (bool) {
    number0 = _asEther(number0);
    number1 = _asEther(number1);
    uint256 value0 = number0.value;
    uint256 value1 = number1.value;
    return value0 > value1;
}

function _isLessThanOrEqual(FixedPointValue memory number0, FixedPointValue memory number1) pure returns (bool) {
    number0 = _asEther(number0);
    number1 = _asEther(number1);
    uint256 value0 = number0.value;
    uint256 value1 = number1.value;
    return value0 <= value1;
}

function _isMoreThanOrEqual(FixedPointValue memory number0, FixedPointValue memory number1) pure returns (bool) {
    number0 = _asEther(number0);
    number1 = _asEther(number1);
    uint256 value0 = number0.value;
    uint256 value1 = number1.value;
    return value0 >= value1;
}

function _add(FixedPointValue memory number0, FixedPointValue memory number1, uint8 asDecimals) pure returns (FixedPointValue memory) {
    number0 = _asEther(number0);
    number1 = _asEther(number1);
    uint256 value0 = number0.value;
    uint256 value1 = number1.value;
    uint256 result = value0 + value1;
    FixedPointValue memory result = FixedPointValue({value: result, decimals: 18});
    result = _asNewDecimals(result, asDecimals);
    return result;
}

function _sub(FixedPointValue memory number0, FixedPointValue memory number1, uint8 asDecimals) pure returns (FixedPointValue memory) {
    number0 = _asEther(number0);
    number1 = _asEther(number1);
    uint256 value0 = number0.value;
    uint256 value1 = number1.value;
    uint256 result = value0 - value1;
    FixedPointValue memory result = FixedPointValue({value: result, decimals: 18});
    result = _asNewDecimals(result, asDecimals);
    return result;
}

function _mul(FixedPointValue memory number0, FixedPointValue memory number1, uint8 asDecimals) pure returns (FixedPointValue memory) {
    number0 = _asEther(number0);
    number1 = _asEther(number1);
    uint256 value0 = number0.value;
    uint256 value1 = number1.value;
    uint256 representation = 10**18;
    uint256 result = Math.mulDiv(value0, value1, representation);
    FixedPointValue memory result = FixedPointValue({value: result, decimals: 18});
    result = _asNewDecimals(result, asDecimals);
    return result;
}

function _div(FixedPointValue memory number0, FixedPointValue memory number1, uint8 asDecimals) pure returns (FixedPointValue memory) {
    number0 = _asEther(number0);
    number1 = _asEther(number1);
    uint256 value0 = number0.value;
    uint256 value1 = number1.value;
    uint256 representation = 10**18;
    uint256 result = Math.mulDiv(value0, representation, value1);
    FixedPointValue memory result = FixedPointValue({value: result, decimals: 18});
    result = _asNewDecimals(result, asDecimals);
    return result;
}

function _asEther(FixedPointValue memory number) pure returns (FixedPointValue memory) {
    return asNewDecimals(number, 18);
}

function _asNewDecimals(FixedPointValue memory number, uint8 asDecimals) pure returns (FixedPointValue memory) {
    uint8 decimals0 = number.decimals;
    uint8 decimals1 = asDecimals;
    uint256 representation0 = 10**decimals0;
    uint256 representation1 = 10**decimals1;
    uint256 value = number.value;
    uint256 result = Math.mulDiv(value, representation1, representation0);
    return FixedPointValue({value: result, decimals: asDecimals});
}