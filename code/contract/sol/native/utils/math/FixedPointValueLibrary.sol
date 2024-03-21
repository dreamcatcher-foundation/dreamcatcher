// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import { Math } from "../../../non-native/openzeppelin/utils/math/Math.sol";
import { ImmutableLibrary } from "../../ImmutableLibrary.sol";

library FixedPointValueLibrary {
    using FixedPointValueLibrary for FixedPointValue;
    using Math for uint256;

    struct FixedPointValue {
        uint256 value;
        uint8 decimals;
    }

    function add(FixedPointValue memory fixedPointValue0, FixedPointValue memory fixedPointValue1) internal pure returns (FixedPointValue memory) {
        onlyMatchingDecimals_(fixedPointValue0, fixedPointValue1);
        uint8 decimals0 = fixedPointValue0.decimals;
        uint256 value0 = fixedPointValue0.value;
        uint256 value1 = fixedPointValue1.value;
        uint256 result = value0 + value1;
        return FixedPointValue({value: result, decimals: decimals0});
    }

    function sub(FixedPointValue memory fixedPointValue0, FixedPointValue memory fixedPointValue1) internal pure returns (FixedPointValue memory) {
        onlyMatchingDecimals_(fixedPointValue0, fixedPointValue1);
        uint8 decimals0 = fixedPointValue0.decimals;
        uint256 value0 = fixedPointValue0.value;
        uint256 value1 = fixedPointValue1.value;
        uint256 result = value0 - value1;
        return FixedPointValue({value: result, decimals: decimals0});
    }

    /**
    * -> (a * b) / (10 ** R)
     */
    function mul(FixedPointValue memory fixedPointValue0, FixedPointValue memory fixedPointValue1) internal pure returns (FixedPointValue memory) {
        onlyMatchingDecimals_(fixedPointValue0, fixedPointValue1);
        uint8 decimals0 = fixedPointValue0.decimals;
        uint256 value0 = fixedPointValue0.value;
        uint256 value1 = fixedPointValue1.value;
        uint256 result = value0.mulDiv(value1, (10**decimals0));
        return FixedPointValue({value: result, decimals: decimals0});
    }

    /**
    * -> (a * (10 ** R)) / b
     */
    function div(FixedPointValue memory fixedPointValue0, FixedPointValue memory fixedPointValue1) internal pure returns (FixedPointValue memory) {
        onlyMatchingDecimals_(fixedPointValue0, fixedPointValue1);
        uint8 decimals0 = fixedPointValue0.decimals;
        uint256 value0 = fixedPointValue0.value;
        uint256 value1 = fixedPointValue1.value;
        uint256 result = value0.mulDiv((10**decimals0), value1);
        return FixedPointValue({value: result, decimals: decimals0});
    }

    function scale(FixedPointValue memory value0, FixedPointValue memory value1) internal pure returns (FixedPointValue memory) {
        onlyMatchingDecimals_(value0, value1);
        
    }

    function slice(FixedPointValue memory value, )

    function asNewDecimals(FixedPointValue memory fixedPointValue, uint8 decimals) internal pure returns (FixedPointValue memory) {
        uint8 decimals = fixedPointValue.decimals;
        uint256 value = fixedPointValue.value;
        if (value == 0)
            return 0;
        if (decimals != N_()) {
            decimals = N_();
            value = fixedPointValue
                .toStandard()
                .value;
        }
        uint256 result = ((value * (10**N_()) / (10**N_())) * (10**decimals)) / (10**N_());
        return FixedPointValue({value: result, decimals: decimals});
    }

    function asStandard(FixedPointValue memory fixedPointValue) internal pure returns (FixedPointValue memory) {
        uint8 decimals = fixedPointValue.decimals;
        uint256 value = fixedPointValue.value;
        if (value == 0)
            return 0;
        uint256 result = ((value * (10**N_()) / (10**decimals)) * (10**N_())) / (10**N_());
        return FixedPointValue({value: result, decimals: N_()});
    }

    function onlyMatchingDecimals_(FixedPointValue memory fixedPointValue0, FixedPointValue memory fixedPointValue1) private pure {
        uint8 decimals0 = fixedPointValue0.decimals;
        uint8 decimals1 = fixedPointValue1.decimals;
        if (decimals0 != decimals1)
            revert("FixedPointValueLibrary: decimals do not match");
        return;
    }

    function N_() private pure returns (uint8) {
        return ImmutableLibrary.NATIVE_DECIMAL_REPRESENTATION();
    }
}