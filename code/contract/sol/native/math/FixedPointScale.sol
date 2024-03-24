// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import { FixedPointValue } from "../shared/FixedPointValue.sol";
import { FixedPointConversion } from "./FixedPointConversion.sol";
import { FixedPointArithmetics } from "./FixedPointArithmetics.sol";
import { FixedPointErrors } from "./FixedPointErrors.sol";

contract FixedPointScale is 
         FixedPointErrors,
         FixedPointArithmetics, 
         FixedPointConversion {
        
    function _slice(FixedPointValue memory num, FixedPointValue memory sliceAsBasisPoints) internal pure only2SimilarFixedPointTypes(num, sliceAsBasisPoints) returns (FixedPointValue memory) {
        return _mul(_div(num, _fullScale(num.decimals)), sliceAsBasisPoints);
    }

    function _scale(FixedPointValue memory num0, FixedPointValue memory num1) internal pure only2SimilarFixedPointTypes(num0, num1) returns (FixedPointValue memory asBasisPoints) {
        return _mul(_div(num0, num1), _fullScale(num0.decimals));
    }

    function _fullScale(uint8 decimals) private pure returns (FixedPointValue memory asBasisPoints) {
        return _asNewDecimals(FixedPointValue({value: 10_000, decimals: 0}), decimals);
    }
}