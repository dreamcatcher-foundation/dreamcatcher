// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

abstract contract FixedPointMathEngine {
    
    function _slc(uint256 x, uint256 percentage) internal pure returns (uint256) {
        return _mul(_div(x, 100e18), percentage);
    }

    function _lss(uint256 x, uint256 y) internal pure returns (uint256 percentage) {
        return 100e18 - _yld(x, y);
    }

    function _yld(uint256 x, uint256 y) internal pure returns (uint256 percentage) {
        return 
            x == 0 ? 0 :
            x >= y ? 100e18 : 
            _pct(x, y);
    }

    function _pct(uint256 x, uint256 y) internal pure returns (uint256 percentage) {
        return _mul(_div(x, y), 100e18);
    }

    function _mul(uint256 x, uint256 y) internal pure returns (uint256) {
        return _muldiv(x, y, 1e18);
    }

    function _div(uint256 x, uint256 y) internal pure returns (uint256) {
        return _muldiv(x, 1e18, y);
    }

    function _toNewPrecision(uint256 x, uint8 decimals0, uint8 decimals1) internal pure returns (uint256) {
        return x == 0 || decimals0 == decimals1 ? x : _muldiv(x, 10**decimals1, 10**decimals0);
    }

    function _muldiv(uint256 x, uint256 y, uint256 z) internal pure returns (uint256) {
        unchecked {
            uint256 prod0;
            uint256 prod1;
            assembly {
                let mm := mulmod(x, y, not(0))
                prod0 := mul(x, y)
                prod1 := sub(sub(mm, prod0), lt(mm, prod0))
            }
            if (prod1 == 0) {
                return prod0 / z;
            }
            require(z > prod1, "overf");
            uint256 remainder;
            assembly {
                remainder := mulmod(x, y, z)
                prod1 := sub(prod1, gt(remainder, prod0))
                prod0 := sub(prod0, remainder)
            }
            uint256 twos = z & (~z + 1);
            assembly {
                z := div(z, twos)
                prod0 := div(prod0, twos)
                twos := add(div(sub(0, twos), twos), 1)
            }
            prod0 |= prod1 * twos;
            uint256 inverse = (3 * z) ^ 2;
            inverse *= 2 - z * inverse;
            inverse *= 2 - z * inverse;
            inverse *= 2 - z * inverse;
            inverse *= 2 - z * inverse;
            inverse *= 2 - z * inverse;
            inverse *= 2 - z * inverse;
            return prod0 * inverse;
        }
    }
}