// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Math as OpenzeppelinMath } from "./imports/openzeppelin/utils/math/Math.sol";

contract FixedPointEngine {
    uint256 constant internal _ONE_HUNDRED_PERCENT = 100 ether;
    uint8 constant internal _MIN_DECIMALS = 2;
    uint8 constant internal _MAX_DECIMALS = 18;

    function _loss(uint256 value0, uint256 value1) internal pure returns (uint256 percentage) {
        return _sub(_ONE_HUNDRED_PERCENT, _yield(value0, value1));
    }

    function _yield(uint256 value0, uint256 value1) internal pure returns (uint256 percentage) {
        if (value0 == 0) {
            return 0;
        }
        return (value0 >= value1) ? _ONE_HUNDRED_PERCENT : _percentageOf(value0, value1);
    }

    function _sliceOf(uint256 value, uint256 percentage) internal pure returns (uint256) {
        return _mul(_div(value, _ONE_HUNDRED_PERCENT), percentage);
    }

    function _percentageOf(uint256 value0, uint256 value1) internal pure returns (uint256 percentage) {
        return _mul(_div(value0, value1), _ONE_HUNDRED_PERCENT);
    }

    function _add(uint256 value0, uint256 value1) internal pure returns (uint256) {
        (bool success, uint256 result) = OpenzeppelinMath.tryAdd(value0, value1);
        if (!success) {
            revert("FixedPointEngine: arithmetic overflow");
        }
        return result;
    }

    function _sub(uint256 value0, uint256 value1) internal pure returns (uint256) {
        (bool success, uint256 result) = OpenzeppelinMath.trySub(value0, value1);
        if (!success) {
            revert("FixedPointEngine: arithmetic underflow");
        }
        return result;
    }

    function _mul(uint256 value0, uint256 value1) internal pure returns (uint256) {
        return OpenzeppelinMath.mulDiv(value0, value1, 10**18);
    }

    function _div(uint256 value0, uint256 value1) internal pure returns (uint256) {
        return OpenzeppelinMath.mulDiv(value0, 10**18, value1);
    }

    function _cast(uint256 value, uint8 decimals0, uint8 decimals1) internal pure returns (uint256) {
        if (decimals0 < _MIN_DECIMALS && decimals1 < _MIN_DECIMALS) {
            revert("FixedPointEngine: `decimals` < `_MIN_DECIMALS`");
        }
        if (decimals0 > _MAX_DECIMALS && decimals1 > _MAX_DECIMALS) {
            revert("FixedPointEngine: `decimals` > `_MAX_DECIMALS`");
        }
        return (value == 0 || decimals0 == decimals1) ? value : OpenzeppelinMath.mulDiv(value, 10**decimals1, 10**decimals0);
    }
}