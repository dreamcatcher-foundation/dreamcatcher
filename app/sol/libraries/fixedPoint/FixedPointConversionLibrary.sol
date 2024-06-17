// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { FixedPointValue } from "./FixedPointValue.sol";
import { Math } from "../imports/openzeppelin/utils/math/Math.sol";

library FixedPointConversionLibrary {
    function convertToEtherDecimals(FixedPointValue memory number) internal pure returns (FixedPointValue memory) {
        return convertToNewDecimals(number, 18);
    }

    function convertToNewDecimals(FixedPointValue memory number, uint8 decimals) internal pure returns (FixedPointValue memory) {
        return FixedPointValue({ value: Math.mulDiv(10**decimals, 10**number.decimals), decimals: decimals });
    }
}