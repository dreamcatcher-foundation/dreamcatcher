// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Math } from "../../../import/openzeppelin/utils/math/Math.sol";
import { FixedPointValue } from "./FixedPointValue.sol";
import { FixedPointValueConversionLib } from "./FixedPointValueConversionLib.sol";

library FixedPointValueArithmeticLib {
    function add(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) internal pure returns (FixedPointValue memory asNewDecimals) {
        number0 = FixedPointValueConversionLib.toEther(number0);
        number1 = FixedPointValueConversionLib.toEther(number1);
        FixedPointValue memory result = add(number0, number1);
        result = FixedPointValueConversionLib.toNewDecimals(result, decimals);
        return result;
    }

    function sub(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) internal pure returns (FixedPointValue memory asNewDecimals) {
        number0 = FixedPointValueConversionLib.toEther(number0);
        number1 = FixedPointValueConversionLib.toEther(number1);
        FixedPointValue memory result = sub(number0, number1);
        result = FixedPointValueConversionLib.toNewDecimals(result, decimals);
        return result;
    }

    function mul(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) internal pure returns (FixedPointValue memory asNewDecimals) {
        number0 = FixedPointValueConversionLib.toEther(number0);
        number1 = FixedPointValueConversionLib.toEther(number1);
        FixedPointValue memory result = mul(number0, number1);
        result = FixedPointValueConversionLib.toNewDecimals(result, decimals);
        return result;
    }

    function div(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) internal pure returns (FixedPointValue memory asNewDecimals) {
        number0 = FixedPointValueConversionLib.toEther(number0);
        number1 = FixedPointValueConversionLib.toEther(number1);
        FixedPointValue memory result = div(number0, number1);
        result = FixedPointValueConversionLib.toNewDecimals(result, decimals);
        return result;
    }

    function add(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory asEther) {
        number0 = FixedPointValueConversionLib.toEther(number0);
        number1 = FixedPointValueConversionLib.toEther(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint8 decimals = number0.decimals;
        uint256 result = value0 + value1;
        return FixedPointValue({ value: result, decimals: decimals });
    }

    function sub(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory asEther) {
        number0 = FixedPointValueConversionLib.toEther(number0);
        number1 = FixedPointValueConversionLib.toEther(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint8 decimals = number0.decimals;
        uint256 result = value0 - value1;
        return FixedPointValue({ value: result, decimals: decimals });
    }

    function mul(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory asEther) {
        number0 = FixedPointValueConversionLib.toEther(number0);
        number1 = FixedPointValueConversionLib.toEther(number1);
        uint8 decimals = number0.decimals;
        uint256 representation = 10**decimals;
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 result = Math.mulDiv(value0, value1, representation);
        return FixedPointValue({ value: result, decimals: decimals });
    }

    function div(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory asEther) {
        number0 = FixedPointValueConversionLib.toEther(number0);
        number1 = FixedPointValueConversionLib.toEther(number1);
        uint8 decimals = number0.decimals;
        uint256 representation = 10**decimals;
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 result = Math.mulDiv(value0, representation, value1);
        return FixedPointValue({ value: result, decimals: decimals });
    }
}