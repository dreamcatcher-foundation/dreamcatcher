// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Math } from "../../import/openzeppelin/utils/math/Math.sol";
import { FixedPointValue } from "./FixedPointValue.sol";

library FixedPointConversion {
    function toEther(FixedPointValue memory number) internal pure returns (FixedPointValue memory asEther) {
        return toNewDecimals(number, 18);
    }

    function toNewDecimals(FixedPointValue memory number, uint8 decimals) internal pure returns (FixedPointValue memory asNewDecimals) {
        uint8 decimals0 = number.decimals;
        uint8 decimals1 = decimals;
        uint256 representation0 = 10**decimals0;
        uint256 representation1 = 10**decimals1;
        uint256 value = number.value;
        uint256 result = Math.mulDiv(value, representation1, representation0);
        return FixedPointValue({ value: result, decimals: decimals });
    }
}