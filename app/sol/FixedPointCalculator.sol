// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Math as OpenzeppelinMath } from "./imports/openzeppelin/utils/math/Math.sol";

contract FixedPointCalculator {
    error PrecisionLoss(uint8 decimals0, uint8 decimals1);

    function _yield(uint256 real, uint256 best, uint8 decimals0, uint8 decimals1) internal pure returns (uint256 percentage) {
        _validate(decimals0, decimals1);
        real = _toEther(real, decimals0);
        best = _toEther(best, decimals1);
        if (best == 0) {
            return 0;
        }
        if (real == 0) {
            return 0;
        }
        if (real >= best) {
            return _oneHundredPercent();
        }
        return _percentageOf(real, best, 18, 18);
    }

    function _sliceOf(uint256 value, uint256 percentage, uint8 decimals0, uint8 decimals1) internal pure returns (uint256) {
        _validate(decimals0, decimals1);
        value = _toEther(value, decimals0);
        percentage = _toEther(percentage, decimals1);
        uint256 result = _div(value, _oneHundredPercent(), 18, 18);
        return _mul(result, percentage, 18, 18);
    }

    function _percentageOf(uint256 value0, uint256 value1, uint8 decimals0, uint8 decimals1) internal pure returns (uint256 percentage) {
        _validate(decimals0, decimals1);
        value0 = _toEther(value0, decimals0);
        value1 = _toEther(value1, decimals1);
        uint256 result = _div(value0, value1, decimals0, decimals1);
        return _mul(result, _oneHundredPercent(), 18, 18);
    }

    function _oneHundredPercent() internal pure returns (uint256 percentage) {
        return 100000000000000000000;
    }

    function _add(uint256 value0, uint256 value1, uint8 decimals0, uint8 decimals1) internal pure returns (uint256) {
        _validate(decimals0, decimals1);
        value0 = _toEther(value0, decimals0);
        value1 = _toEther(value1, decimals1);
        return value0 + value1;
    }

    function _sub(uint256 value0, uint256 value1, uint8 decimals0, uint8 decimals1) internal pure returns (uint256) {
        _validate(decimals0, decimals1);
        value0 = _toEther(value0, decimals0);
        value1 = _toEther(value1, decimals1);
        return value0 - value1;
    }

    function _mul(uint256 value0, uint256 value1, uint8 decimals0, uint8 decimals1) internal pure returns (uint256) {
        _validate(decimals0, decimals1);
        value0 = _toEther(value0, decimals0);
        value1 = _toEther(value1, decimals1);
        return _muldiv(value0, value1, 10**decimals0);
    }

    function _div(uint256 value0, uint256 value1, uint8 decimals0, uint8 decimals1) internal pure returns (uint256) {
        _validate(decimals0, decimals1);
        value0 = _toEther(value0, decimals0);
        value1 = _toEther(value1, decimals1);
        return _muldiv(value0, 10**decimals0, value1);
    }

    function _toEther(uint256 value, uint8 decimals) internal pure returns (uint256) {
        return _toNewDecimals(value, decimals, 18);
    }

    function _toNewDecimals(uint256 value, uint8 decimals0, uint8 decimals1) internal pure returns (uint256) {
        return _muldiv(value, 10**decimals1, 10**decimals0);
    }

    function _muldiv(uint256 value0, uint256 value1, uint256 value2) internal pure returns (uint256) {
        return OpenzeppelinMath.mulDiv(value0, value1, value2);
    }

    function _validate(uint8 decimals0, uint8 decimals1) private pure {
        if (decimals0 > 18 || decimals1 > 18) {
            revert PrecisionLoss(decimals0, decimals1);
        }
    }
}