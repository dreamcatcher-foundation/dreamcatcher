// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;
import { FixedPointValueLibrary } from "./FixedPointValueLibrary.sol";
import { ImmutableLibrary } from "../../ImmutableLibrary.sol";

library FixedPointValueConversionLibrary {
    using FixedPointValueConversionLibrary for FixedPointValueLibrary.FixedPointValue;
    using FixedPointValueLibrary for FixedPointValueLibrary.FixedPointValue;
    using FixedPointValueLibrary for uint256;

    /**
    * -> N => R
     */
    function toR(FixedPointValueLibrary.FixedPointValue memory fixedPointValue, uint8 decimals) internal pure returns (FixedPointValueLibrary.FixedPointValue memory) {
        if (fixedPointValue.value() == 0)
            return 0;
        if (fixedPointValue.r() != N_())
            /**
            * -> The conversion assumes the value is represented in
            *    the form of N. If the value is not in the form
            *    of N, it will convert it to N first.
            *
            * -> This means that if the value is greater than N,
            *    precision loss will affect the result.
             */
            fixedPointValue = fixedPointValue.toN();
        return (((fixedPointValue.value() * (10**N_()) / (10**N_())) * (10**decimals)) / (10**N_()))
            .toFixedPointValue(decimals);
    }

    /**
    * -> R => N
     */
    function toN(FixedPointValueLibrary.FixedPointValue memory fixedPointValue) internal pure returns (FixedPointValueLibrary.FixedPointValue memory) {
        if (fixedPointValue.value() == 0)
            return 0;
        return ((fixedPointValue.value() * (10**N_()) / (10**fixedPointValue.r())) * (10**N_())) / (10**N_())
            .toFixedPointValue(fixedPointValue.r());
    }

    function N_() {
        return ImmutableLibrary.NATIVE_DECIMAL_REPRESENTATION();
    }
}