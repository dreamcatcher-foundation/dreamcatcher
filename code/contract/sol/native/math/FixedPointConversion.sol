// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import { FixedPointValue } from "../shared/FixedPointValue.sol";
import { FixedPointUtils } from "./FixedPointUtils.sol";

contract FixedPointConversion is
         FixedPointUtils {
            
    function _asEther(FixedPointValue memory num) internal pure returns (FixedPointValue memory) {
        return _asNewDecimals(num, 18);
    }

    function _asNewDecimals(FixedPointValue memory num, uint8 decimals) internal pure returns (FixedPointValue memory) {
        return FixedPointValue({value: _mulDiv(num.value, _representation(decimals), _representation(num.decimals)), decimals: decimals});
    }
}