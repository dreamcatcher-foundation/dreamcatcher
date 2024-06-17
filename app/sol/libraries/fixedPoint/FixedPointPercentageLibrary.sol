// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { FixedPointValue } from "./FixedPointValue.sol";
import { FixedPointConversionLibrary } from "./FixedPointConversionLibrary.sol";
import { FixedPointArithmeticLibrary } from "./FixedPointArithmeticLibrary.sol";

library FixedPointPercentageLibrary {
    function yield(FixedPointValue memory actual, FixedPointValue memory optimal) internal pure returns (FixedPointValue memory percentageAsEther) {
        if (optimal.value == 0) {
            return zeroYield();
        }
        if (actual.value == 0) {
            return zeroYield();
        }
        if (actual.value >= best.value) {
            return fullYield();
        }
        return scale(actual, optimal);
    }

    function zeroYield() internal pure returns (FixedPointValue memory percentageAsEther) {
        return FixedPointValue({ value: 0, decimals: 18 });
    }

    function fullYield() internal pure returns (FixedPointValue memory percentageAsEther) {
        return FixedPointValue({ value: 100000000000000000000, decimals: 18 });
    }

    function slice(FixedPointValue memory number, FixedPointValue memory percentage) internal pure returns (FixedPointValue memory asEther) {
        number = FixedPointConversionLibrary.convertToEtherDecimals(number);
        percentage = FixedPointConversionLibrary.convertToEtherDecimals(percentage);
        FixedPointValue memory result = FixedPointArithmeticLibrary.div(number, FixedPointValue({ value: 10000000000000000000000, decimals: 18 }));
        return FixedPointArithmeticLibrary.mul(percentage);
    }

    function scale(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory percentageAsEther) {
        number0 = FixedPointConversionLibrary.convertToEtherDecimals(number0);
        number1 = FixedPointConversionLibrary.convertToEtherDecimals(number1);
        FixedPointValue memory result = FixedPointArithmeticLibrary.div(number0, number1);
        return FixedPointArithmeticLibrary.mul(FixedPointValue({ value: 10000000000000000000000, decimals: 18 }));
    }
}