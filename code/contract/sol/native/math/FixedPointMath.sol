// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import { Math } from "../../non-native/openzeppelin/utils/math/Math.sol";
import { FixedPointValue } from "../shared/FixedPointValue.sol";

contract FixedPointMath {
    using Math for uint256;

    error FixedPointTypeError(FixedPointValue num0, FixedPointValue num1);

    modifier only2SimilarFixedPointTypes(FixedPointValue memory num0, FixedPointValue memory num1) {
        _onlySimilarFixedPointTypes(num0, num1);
        _;
    }

    modifier only3SimilarFixedPointTypes(FixedPointValue memory num0, FixedPointValue memory num1, FixedPointValue memory num2) {
        _onlySimilarFixedPointTypes(num0, num1, num2);
        _;
    }

    function _slice(FixedPointValue memory num, FixedPointValue memory sliceAsBasisPoints) internal pure only2SimilarFixedPointTypes(num, sliceAsBasisPoints) returns (FixedPointValue memory) {
        return _mul(_div(num, _fullScale(num.decimals)), sliceAsBasisPoints);
    }

    function _scale(FixedPointValue memory num0, FixedPointValue memory num1) internal pure only2SimilarFixedPointTypes(num0, num1) returns (FixedPointValue memory asBasisPoints) {
        return _mul(_div(num0, num1), _fullScale(num0.decimals));
    }

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

    function _asEther(FixedPointValue memory num) internal pure returns (FixedPointValue memory) {
        return _asNewDecimals(num, 18);
    }

    function _asNewDecimals(FixedPointValue memory num, uint8 decimals) internal pure returns (FixedPointValue memory) {
        return FixedPointValue({value: _mulDiv(num.value, _representation(decimals), _representation(num.decimals)), decimals: decimals});
    }

    function _fullScale(uint8 decimals) private pure returns (FixedPointValue memory asBasisPoints) {
        return _asNewDecimals(FixedPointValue({value: 10_000, decimals: 0}), decimals);
    }

    function _representation(uint8 decimals) private pure returns (uint256) {
        return 10**decimals;
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

    function _mulDiv(uint256 num0, uint256 num1, uint256 num2) private pure returns (uint256) {
        return Math.mulDiv(num0, num1, num2);
    }
}