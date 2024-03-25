// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import '../../types/FixedPointValue.sol';
import '../../../non-native/openzeppelin/utils/math/Math.sol';
import '../../Generator.sol';

interface IFixedPointPureMathMod {
    function slice(FixedPointValue memory number, FixedPointValue memory slice, uint8 decimals) external pure returns (FixedPointValue memory);
    function scale(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) external pure returns (FixedPointValue memory proportion);
    function sum(FixedPointValue[] memory numbers, uint8 decimals) external pure returns (FixedPointValue memory);
    function min(FixedPointValue[] memory numbers, uint8 decimals) external pure returns (FixedPointValue memory);
    function max(FixedPointValue[] memory numbers, uint8 decimals) external pure returns (FixedPointValue memory);
    function isEqual(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (bool);
    function isLessThan(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (bool);
    function isMoreThan(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (bool);
    function isLessThanOrEqual(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (bool);
    function isMoreThanOrEqual(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (bool);
    function add(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) external pure returns (FixedPointValue memory);
    function sub(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) external pure returns (FixedPointValue memory);
    function mul(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) external pure returns (FixedPointValue memory);
    function div(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) external pure returns (FixedPointValue memory);
    function add(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (FixedPointValue memory);
    function sub(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (FixedPointValue memory);
    function mul(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (FixedPointValue memory);
    function div(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (FixedPointValue memory);
    function asEther(FixedPointValue memory number) external pure returns (FixedPointValue memory);
    function asNewDecimals(FixedPointValue memory number) external pure returns (FixedPointValue memory);
    function representation(uint8 decimals) external pure returns (uint256);
    function mulDiv(uint256 number0, uint256 number1, uint256 number2) external pure returns (uint256);
}

contract FixedPointPureMathMod is IFixedPointPureMathMod {
    using Math for uint256;

    error TypeError__IncompatibleDecimals();

    constructor() {}

    function slice(FixedPointValue memory number, FixedPointValue memory slice, uint8 decimals) public pure virtual returns (FixedPointValue memory) {
        number = asEther(number0);
        proportion = asEther(proportion);
        FixedPointValue memory proportion = FixedPointValue({value: 10000_0000_0000_0000_0000_00, decimals: 18});
        FixedPointValue memory result = div(number, proportion);
        result = mul(result, slice);
        result = asNewDecimals(result, decimals);
        return result;
    }

    function scale(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) public pure virtual returns (FixedPointValue memory proportion) {
        number0 = asEther(number0);
        number1 = asEther(number1);
        FixedPointValue memory proportion = FixedPointValue({value: 10000_0000_0000_0000_0000_00, decimals: 18});
        FixedPointValue memory result = div(number0, number1);
        result = mul(result, proportion);
        result = asNewDecimals(result, decimals);
        return result;
    }

    function sum(FixedPointValue[] memory numbers, uint8 decimals) public pure virtual returns (FixedPointValue memory) {
        FixedPointValue memory sum = FixedPointValue({value: 0, decimals: 18});
        for (uint256 i = 0; i < numbers.length; i++) {
            FixedPointValue memory number = numbers[i];
            number = asEther(number);
            sum = add(sum, number);
        }
        sum = asNewDecimals(sum, decimals);
        return sum;
    }

    function min(FixedPointValue[] memory numbers, uint8 decimals) public pure virtual returns (FixedPointValue memory) {
        FixedPointValue memory min = max(numbers, 18);
        for (uint256 i = 0; i < numbers.length; i++) {
            FixedPointValue memory number = numbers[i];
            number = asEther(number);
            bool numberIsLessThanMin = isLessThan(number, min);
            if (numberIsLessThanMin) {
                min = number;
            }
        }
        min = asNewDecimals(min, decimals);
        return min;
    }

    function max(FixedPointValue[] memory numbers, uint8 decimals) public pure virtual returns (FixedPointValue memory) {
        FixedPointValue memory max = FixedPointValue({value: 0, decimals: 18});
        for (uint256 i = 0; i < numbers.length; i++) {
            FixedPointValue memory number = numbers[i];
            number = asEther(number);
            bool numberIsMoreThanMax = isMoreThan(number, max);
            if (numberIsMoreThanMax) {
                max = number;
            }
        }
        max = asNewDecimals(max, decimals);
        return max;
    }

    function isEqual(FixedPointValue memory number0, FixedPointValue memory number1) public pure virtual returns (bool) {
        number0 = asEther(number0);
        number1 = asEther(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        return value0 == value1;
    }

    function isLessThan(FixedPointValue memory number0, FixedPointValue memory number1) public pure virtual returns (bool) {
        number0 = asEther(number0);
        number1 = asEther(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        return value0 < value1;
    }

    function isMoreThan(FixedPointValue memory number0, FixedPointValue memory number1) public pure virtual returns (bool) {
        number0 = asEther(number0);
        number1 = asEther(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        return value0 > value1;
    }

    function isLessThanOrEqual(FixedPointValue memory number0, FixedPointValue memory number1) public pure virtual returns (bool) {
        number0 = asEther(number0);
        number1 = asEther(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        return value0 <= value1;
    }

    function isMoreThanOrEqual(FixedPointValue memory number0, FixedPointValue memory number1) public pure virtual returns (bool) {
        number0 = asEther(number0);
        number1 = asEther(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        return value0 >= value1;
    }

    function add(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) public pure virtual returns (FixedPointValue memory) {
        number0 = asEther(number0);
        number1 = asEther(number1);
        FixedPointValue memory result = add(number0, number1);
        result = asNewDecimals(result, decimals);
        return result;
    }

    function sub(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) public pure virtual returns (FixedPointValue memory) {
        number0 = asEther(number0);
        number1 = asEther(number1);
        FixedPointValue memory result = sub(number0, number1);
        result = asNewDecimals(result, decimals);
        return result;
    }

    function mul(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) public pure virtual returns (FixedPointValue memory) {
        number0 = asEther(number0);
        number1 = asEther(number1);
        FixedPointValue memory result = mul(number0, number1);
        result = asNewDecimals(result, decimals);
        return result;
    }

    function div(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) public pure virtual returns (FixedPointValue memory) {
        number0 = asEther(number0);
        number1 = asEther(number1);
        FixedPointValue memory result = div(number0, number1);
        result = asNewDecimals(result, decimals);
        return result;
    }

    function add(FixedPointValue memory number0, FixedPointValue memory number1) public pure virtual returns (FixedPointValue memory) {
        _checkTypes(number0, number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 decimals = number0.decimals;
        uint256 result = value0 + value1;
        return FixedPointValue({value: result, decimals: decimals});
    }

    function sub(FixedPointValue memory number0, FixedPointValue memory number1) public pure virtual returns (FixedPointValue memory) {
        _checkTypes(number0, number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 decimals = number0.decimals;
        uint256 result = value0 - value1;
        return FixedPointValue({value: result, decimals: decimals});
    }

    function mul(FixedPointValue memory number0, FixedPointValue memory number1) public pure virtual returns (FixedPointValue memory) {
        _checkTypes(number0, number1);
        uint8 decimals = number0.decimals;
        uint256 representation_ = representation(decimals);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 result = mulDiv(value0, value1, representation);
        return FixedPointValue({value: result, decimals: decimals});
    }

    function div(FixedPointValue memory number0, FixedPointValue memory number1) public pure virtual returns (FixedPointValue memory) {
        _checkTypes(number0, number1);
        uint8 decimals = number0.decimals;
        uint256 representation_ = representation(decimals);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 result = mulDiv(value0, representation, value1);
        return FixedPointValue({value: result, decimals: decimals});
    }

    function asEther(FixedPointValue memory number) public pure virtual returns (FixedPointValue memory) {
        return asNewDecimals(number, 18);
    }

    function asNewDecimals(FixedPointValue memory number, uint8 decimals) public pure virtual returns (FixedPointValue memory) {
        uint8 decimals0 = num.decimals;
        uint8 decimals1 = decimals;
        uint256 representation0 = representation(decimals0);
        uint256 representation1 = representation(decimals1);
        uint256 value = number.value;
        uint256 result = mulDiv(value, representation1, representation0);
        return FixedPointValue({value: result, decimals: decimals});
    }

    function representation(uint8 decimals) public pure virtual returns (uint256) {
        return 10**decimals;
    }

    function mulDiv(uint256 number0, uint256 number1, uint256 number2) public pure virtual returns (uint256) {
        return Math.mulDiv(number0, number1, number2);
    }

    function _checkTypes(FixedPointValue memory number0, FixedPointValue memory number1, FixedPointValue memory number2) internal pure virtual returns (bool) {
        uint8 decimals0 = number0.decimals;
        uint8 decimals1 = number1.decimals;
        uint8 decimals2 = number2.decimals;
        if (decimals0 != decimals1) {
            revert TypeError__IncompatibleDecimals();
        }
        if (decimals0 != decimals2) {
            revert TypeError__IncompatibleDecimals();
        }
        return true;
    }

    function _checkTypes(FixedPointValue memory number0, FixedPointValue memory number1) internal pure virtual returns (bool) {
        uint8 decimals0 = number0.decimals;
        uint8 decimals1 = number1.decimals;
        if (decimals0 != decimals1) {
            revert TypeError__IncompatibleDecimals();
        }
        return true;
    }
}

contract FixedPointPureMathModGenerator is IGenerator {
    constructor() {}

    function generate() external virtual returns (address) {
        address module = address(new FixedPointPureMathMod());
        emit Generation(msg.sender, module);
        return module;
    }
}