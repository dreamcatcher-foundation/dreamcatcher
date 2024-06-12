// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { FixedPointValue } from "./FixedPointValue.sol";
import { FixedPointConversion } from "./FixedPointConversion.sol";
import { FixedPointMath } from "./FixedPointMath.sol";

library FixedPointYield {
    function calculateYield(FixedPointValue memory best, FixedPointValue memory real) internal pure returns (FixedPointValue memory asBasisPointsInEther) {
        if (best.value == 0) {
            return zeroYield();
        }
        if (real.value == 0) {
            return zeroYield();
        }
        if (real.value >= best.value) {
            return fullYield();
        }
        return FixedPointMath.scale(real, best, 18);
    }

    function zeroYield() internal pure returns (FixedPointValue memory asEtherBasisPoints) {
        return FixedPointValue({ value: 0, decimals: 18 });
    }

    function fullYield() internal pure returns (FixedPointValue memory asEtherBasisPoints) {
        return FixedPointConversion.toEther(FixedPointValue({ value: 10000, decimals: 0 }));
    }
}