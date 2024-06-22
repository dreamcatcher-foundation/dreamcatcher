// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Math } from "./imports/openzeppelin/utils/math/Math.sol";

/** 100 ether -> 100% */
contract FixedPointCalculator {
    function _percentageOf(uint256 a, uint256 b) internal pure returns (uint256 percentage) { /** (fixed-point, 18 decimals) */
        return _mul(_div(a, b), 100 ether);
    }

    function _loss(uint256 a, uint256 b) internal pure returns (uint256 percentage) { /** (fixed-point, 18 decimals) */
        return _sub(100 ether, _yield(a, b));
    }

    function _yield(uint256 a, uint256 b) internal pure returns (uint256 percentage) { /** (fixed-point, 18 decimals) */
        if (a == 0) {
            return 0;
        }
        return (a >= b) ? 100 ether : _percentageOf(a, b);
    }

    function _slice(uint256 x, uint256 percentage) internal pure returns (uint256) { /** (fixed-point, 18 decimals) */
        return _mul(_div(x, 100 ether), percentage);
    }

    function _add(uint256 a, uint256 b) internal pure returns (uint256) { /** (fixed-point, 18 decimals) */
        unchecked {
            uint256 c = a + b;
            if (c < a) {
                revert("UINT_OVERF");
            }
            return c;
        }
    }

    function _sub(uint256 a, uint256 b) internal pure returns (uint256) { /** (fixed-point, 18 decimals) */
        unchecked {
            if (b > a) {
                revert("UINT_UNDER");
            }
            return a - b;
        }
    }

    function _mul(uint256 a, uint256 b) internal pure returns (uint256) { /** (fixed-point, 18 decimals) */
        return _muldiv(a, b, 10**18);
    }

    function _div(uint256 a, uint256 b) internal pure returns (uint256) { /** (fixed-point, 18 decimals) */
        return _muldiv(a, 10**18, b);
    }

    /** ie. 6.000000 > 6.000000000000000000 */
    function _cast(uint256 x, uint8 decimals0, uint8 decimals1) internal pure returns (uint256) {
        require(decimals0 >= 2 && decimals1 >= 2 && decimals0 <= 18 && decimals1 <= 18, "DECIMALS_OUT_OF_BOUNDS");
        return (x == 0 || decimals0 == decimals1) ? x : _muldiv(x, 10**decimals1, 10**decimals0);
    }

    function _muldiv(uint256 a, uint256 b, uint256 denominator) internal pure return (uint256) {
        return Math.mulDiv(a, b, denominator);
    }
}