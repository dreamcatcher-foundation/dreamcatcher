// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import { Math } from "../../non-native/openzeppelin/utils/math/Math.sol";
import { FixedPointValue } from "../shared/FixedPointValue.sol";

contract FixedPointMath {
    using Math for uint256;

    error FixedPointTypeError(FixedPointValue memory num0, FixedPointValue memory num1);
    error FixedPointTypeMatchingError(FixedPointValue[] memory nums);

    modifier onlySimilarFixedPointType(FixedPointValue[] memory nums) {
        _onlySimilarFixedPointType(nums);
        _;
    }

    function _slice(FixedPointValue memory num, FixedPointValue memory sliceAsBasisPoints) internal pure onlySimilarFixedPointType([num, sliceAsBasisPoints]) returns (FixedPointValue memory) {
        return _mul(_div(num, _fullScale(num.decimals)), sliceAsBasisPoints);
    }

    function _scale(FixedPointValue memory num0, FixedPointValue memory num1) internal pure onlySimilarFixedPointType([num0, num1]) returns (FixedPointValue memory asBasisPoints) {
        return _mul(_div(num0, num1), _fullScale(num0.decimals));
    }

    function _add(FixedPointValue memory num0, FixedPointValue memory num1) internal pure onlySimilarFixedPointType([num0, num1]) returns (FixedPointValue memory) {
        return FixedPointValue({value: num0.value + num1.value, decimals: num0.decimals});
    }

    function _sub(FixedPointValue memory num0, FixedPointValue memory num1) internal pure onlySimilarFixedPointType([num0, num1]) returns (FixedPointValue memory) {
        return FixedPointValue({value: num0.value - num1.value, decimals: num0.decimals});
    }

    function _mul(FixedPointValue memory num0, FixedPointValue memory num1) internal pure onlySimilarFixedPointType([num0, num1]) returns (FixedPointValue memory) {
        return FixedPointValue({value: _mulDiv(num0.value, num1.value, _representation(num0.decimals), decimals: num0.decimals)});
    }

    function _div(FixedPointValue memory num0, FixedPointValue memory num1) internal pure onlySimilarFixedPointType([num0, num1]) returns (FixedPointValue memory) {
        return FixedPointValue({value: _mulDiv(num0.value, _representation(num0.decimals), num1.value), decimals: num0.decimals});
    }

    function _asEther(FixedPointValue memory num) internal pure returns (FixedPointValue memory) {
        return _asNewDecimals(num, 18);
    }

    function _asNewDecimals(FixedPointValue memory num, uint8 decimals) internal pure returns (FixedPointValue memory) {
        uint8 decimals0 = num.decimals;
        uint8 decimals1 = decimals;
        uint256 value = num.value;
        value = _mulDiv(value, _representation(decimals1), _representation(decimals0));
        return FixedPointValue({value: value, decimals: decimals1});
    }

    function _fullScale(uint8 decimals) private pure returns (FixedPointValue memory asBasisPoints) {
        return _asNewDecimals(FixedPointValue({value: 10_000, decimals: 0}), decimals);
    }

    function _representation(uint8 decimals) private pure returns (uint256) {
        return 10**decimals;
    }

    function _onlySimilarFixedPointType(FixedPointValue[] memory nums) private pure {
        _checkMinFixedPointTypeMatches(nums);
        _checkMaxFixedPointTypeMatches(nums);
        for (uint8 i = 1; i < nums.length; i++) {
            _onlyIfFixedPointTypesMatch(nums[0], nums[i]);
        }
    }

    function _onlyIfFixedPointTypesMatch(FixedPointValue memory num0, FixedPointValue memory num1) private pure {
        if (num0.decimals != num1.decimals) {
            revert FixedPointTypeError(num0, num1);
        }
    }

    function _checkMinFixedPointTypeMatches(FixedPointValue[] memory nums) private pure {
        if (nums.length < 2) {
            revert FixedPointTypeMatchingError(nums);
        }
    }

    function _checkMaxFixedPointTypeMatches(FixedPointValue[] memory nums) private pure {
        if (nums.length > 9) {
            revert FixedPointTypeMatchingError(nums);
        }
    }

    function _mulDiv(uint256 num0, uint256 num1, uint256 num2) private pure returns (uint256) {
        return Math.mulDiv(num0, num1);
    }
}