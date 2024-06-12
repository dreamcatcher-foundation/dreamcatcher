// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { FixedPointConversion } from "./FixedPointConversion.sol";
import { FixedPointArithmetic } from "./FixedPointArithmetic.sol";
import { FixedPointValue } from "./FixedPointValue.sol";

library FixedPointMath {
    function slice(FixedPointValue memory number, FixedPointValue memory slice, uint8 decimals) internal pure returns (FixedPointValue memory asNewDecimals) {
        number = FixedPointConversion.toEther(number);
        slice = FixedPointConversion.toEther(slice);
        FixedPointValue memory proportion = FixedPointValue({ value: 10000000000000000000000, decimals: 18 });
        FixedPointValue memory result = FixedPointArithmetic.div(number, proportion);
        result = FixedPointArithmetic.mul(result, slice);
        result = FixedPointConversion.toNewDecimals(result, decimals);
        return result;
    }

    function scale(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) internal pure returns (FixedPointValue memory asBasisPointsInNewDecimals) {
        number0 = FixedPointConversion.toEther(number0);
        number1 = FixedPointConversion.toEther(number1);
        FixedPointValue memory proportion = FixedPointValue({ value: 10000000000000000000000, decimals: 18 });
        FixedPointValue memory result = FixedPointArithmetic.div(number0, number1);
        result = FixedPointArithmetic.mul(result, proportion);
        result = FixedPointConversion.toNewDecimals(result, decimals);
        return result;
    }
}