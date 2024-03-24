// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import { FixedPointValue } from "../shared/FixedPointValue.sol";
import { FixedPointUtils } from "./FixedPointUtils.sol";
import { FixedPointErrors } from "./FixedPointErrors.sol";

contract FixedPointArithmetics is
         FixedPointErrors,
         FixedPointUtils {
            
    function _add(FixedPointValue memory num0, FixedPointValue memory num1) internal pure only2SimilarFixedPointTypes(num0, num1) returns (FixedPointValue memory) {
        return FixedPointValue({value: num0.value + num1.value, decimals: num0.decimals});
    }

    function _sub(FixedPointValue memory num0, FixedPointValue memory num1) internal pure only2SimilarFixedPointTypes(num0, num1) returns (FixedPointValue memory) {
        return FixedPointValue({value: num0.value - num1.value, decimals: num0.decimals});
    }

    function _mul(FixedPointValue memory num0, FixedPointValue memory num1) internal pure only2SimilarFixedPointTypes(num0, num1) returns (FixedPointValue memory) {
        return FixedPointValue({value: _mulDiv(num0.value, num1.value, _representation(num0.decimals)), decimals: num0.decimals});
    }

    function _div(FixedPointValue memory num0, FixedPointValue memory num1) internal pure only2SimilarFixedPointTypes(num0, num1) returns (FixedPointValue memory) {
        return FixedPointValue({value: _mulDiv(num0.value, _representation(num0.decimals), num1.value), decimals: num0.decimals});
    }
}