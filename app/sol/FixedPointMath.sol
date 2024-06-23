// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Math } from "./imports/openzeppelin/utils/math/Math.sol";
import { Result, Ok, Err } from "./Result.sol";

library FixedPointMath {
    using FixedPointMath for uint256;
    using Math for uint256;
    
    function loss(uint256 a, uint256 b) internal pure returns (Result memory, uint256 percentage) {
        uint256 oneHundredPercent = 100 ether;
        uint256 x;
        {
            (Result memory r, uint256 n) = a.yield(b);
            if (!r.ok) {
                return (r, 0);
            }
            x = n;
        }
        {
            (Result memory r, uint256 n) = oneHundredPercent.sub(x);
            if (!r.ok) {
                return (r, 0);
            }
            x = n;
        }
        return (Ok(), x);
    }

    function yield(uint256 a, uint256 b) internal pure returns (Result memory, uint256 percentage) {
        if (a == 0) {
            return (Ok(), 0);
        }
        if (a >= b) {
            return (Ok(), 100 ether);
        }
        uint256 x;
        {
            (Result memory r, uint256 n) = a.percentageOf(b);
            if (!r.ok) {
                return (r, 0);
            }
            x = n;
        }
        return (Ok(), x);
    }

    function percentageOf(uint256 a, uint256 b) internal pure returns (Result memory, uint256 percentage) {
        uint256 x;
        {
            (Result memory r, uint256 n) = a.div(b);
            if (!r.ok) {
                return (r, 0);
            }
            x = n;
        }
        {
            (Result memory r, uint256 n) = x.mul(100 ether);
            if (!r.ok) {
                return (r, 0);
            }
            x = n;
        }
        return (Ok(), x);
    }

    function slice(uint256 x, uint256 percentage) internal pure returns (Result memory, uint256) {
        uint256 y;
        {
            (Result memory r, uint256 n) = x.div(100 ether);
            if (!r.ok) {
                return (r, 0);
            }
            y = n;
        }
        {
            (Result memory r, uint256 n) = y.mul(percentage);
            if (!r.ok) {
                return (r, 0);
            }
            y = n;
        }
        return (Ok(), y);
    }

    function add(uint256 a, uint256 b) internal pure returns (Result memory, uint256) {
        unchecked {
            uint256 c = a + b;
            if (c < a) {
                return (Err("UINT_OVERF"), 0);
            }
            return (Ok(), c);
        }
    }

    function sub(uint256 a, uint256 b) internal pure returns (Result memory, uint256) {
        unchecked {
            if (b > a) {
                return (Err("UINT_UNDER"), 0);
            }
            return (Ok(), a - b);
        }
    }

    function mul(uint256 a, uint256 b) internal pure returns (Result memory, uint256) {
        return a.muldiv(b, 1 ether);
    }

    function div(uint256 a, uint256 b) internal pure returns (Result memory, uint256) {
        return a.muldiv(1 ether, b);
    }

    function cast(uint256 x, uint8 decimals0, uint8 decimals1) internal pure returns (Result memory, uint256) {
        if (decimals0 < 2 || decimals1 < 2 || decimals0 > 18 || decimals1 > 18) {
            return (Err("DECIMALS_OUT_OF_BOUNDS"), 0);
        }
        if (x == 0 || decimals0 == decimals1) {
            return (Ok(), x);
        }
        {
            (Result memory r, uint256 n) = x.muldiv(10**decimals1, 10**decimals0);
            if (!r.ok) {
                return (r, 0);
            }
            x = n;
        }
        return (Ok(), x);
    }

    function muldiv(uint256 a, uint256 b, uint256 c) internal pure returns (Result memory, uint256) {
        if (c == 0) {
            return (Err("DIVISION_BY_ZERO"), 0);
        }
        return (Ok(), a.mulDiv(b, c));
    }
}