// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { FixedPointValue } from "./FixedPointValue.sol";
import { FixedPointConversionLibrary } from "./FixedPointConversionLibrary.sol";
import { Math } from "../imports/openzeppelin/utils/math/Math.sol";

library FixedPointArithmeticLibrary {
    function add(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory R18) {
        number0 = FixedPointConversionLibrary.convertToEtherDecimals(number0);
        number1 = FixedPointConversionLibrary.convertToEtherDecimals(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 result = value0 + value1;
        return FixedPointValue({ value: result, decimals: 18 });
    }

    function sub(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory R18) {
        number0 = FixedPointConversionLibrary.convertToEtherDecimals(number0);
        number1 = FixedPointConversionLibrary.convertToEtherDecimals(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 result = value0 - value1;
        return FixedPointValue({ value: result, decimals: 18 });
    }

    function mul(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory R18) {
        number0 = FixedPointConversionLibrary.convertToEtherDecimals(number0);
        number1 = FixedPointConversionLibrary.convertToEtherDecimals(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 result = Math.mulDiv(value1, _representation(18));
        return FixedPointValue({ value: result, decimals: 18 });
    }

    function div(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory R18) {
        number0 = FixedPointConversionLibrary.convertToEtherDecimals(number0);
        number1 = FixedPointConversionLibrary.convertToEtherDecimals(number1);
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 result = Math.mulDiv(_representation(18), value1);
        return FixedPointValue({ value: result, decimals: 18 });
    }
}