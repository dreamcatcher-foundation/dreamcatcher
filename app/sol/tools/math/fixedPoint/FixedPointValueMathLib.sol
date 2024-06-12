// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { FixedPointValueConversionLib } from "./FixedPointValueConversionLib.sol";
import { FixedPointValueArithmeticLib } from "./FixedPointValueArithmeticLib.sol";
import { FixedPointValue } from "./FixedPointValue.sol";

library FixedPointValueMathLib {
    function slice(FixedPointValue memory number, FixedPointValue memory slice, uint8 decimals) internal pure returns (FixedPointValue memory asNewDecimals) {
        number = FixedPointValueConversionLib.toEther(number);
        slice = FixedPointValueConversionLib.toEther(slice);
        FixedPointValue memory proportion = FixedPointValue({ value: 10000000000000000000000, decimals: 18 });
        FixedPointValue memory result = FixedPointValueArithmeticLib.div(number, proportion);
        result = FixedPointValueArithmeticLib.mul(result, slice);
        result = FixedPointValueConversionLib.toNewDecimals(result, decimals);
        return result;
    }

    function scale(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) internal pure returns (FixedPointValue memory asBasisPointsInNewDecimals) {
        number0 = FixedPointValueConversionLib.toEther(number0);
        number1 = FixedPointValueConversionLib.toEther(number1);
        FixedPointValue memory proportion = FixedPointValue({ value: 10000000000000000000000, decimals: 18 });
        FixedPointValue memory result = FixedPointValueArithmeticLib.div(number0, number1);
        result = FixedPointValueArithmeticLib.mul(result, proportion);
        result = FixedPointValueConversionLib.toNewDecimals(result, decimals);
        return result;
    }
}