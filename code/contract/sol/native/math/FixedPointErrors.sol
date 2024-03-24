// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import { FixedPointValue } from "../shared/FixedPointValue.sol";

contract FixedPointErrors {
    error FixedPointTypeError(FixedPointValue num0, FixedPointValue num1);

    modifier only2SimilarFixedPointTypes(FixedPointValue memory num0, FixedPointValue memory num1) {
        _onlySimilarFixedPointTypes(num0, num1);
        _;
    }

    modifier only3SimilarFixedPointTypes(FixedPointValue memory num0, FixedPointValue memory num1, FixedPointValue memory num2) {
        _onlySimilarFixedPointTypes(num0, num1, num2);
        _;
    }

    function _onlySimilarFixedPointTypes(FixedPointValue memory num0, FixedPointValue memory num1) private pure {
        _onlyIfFixedPointTypesMatch(num0, num1);
    }

    function _onlySimilarFixedPointTypes(FixedPointValue memory num0, FixedPointValue memory num1, FixedPointValue memory num2) private pure {
        _onlyIfFixedPointTypesMatch(num0, num1);
        _onlyIfFixedPointTypesMatch(num0, num2);
    }

    function _onlyIfFixedPointTypesMatch(FixedPointValue memory num0, FixedPointValue memory num1) private pure {
        if (num0.decimals != num1.decimals) {
            revert FixedPointTypeError(num0, num1);
        }
    }
}