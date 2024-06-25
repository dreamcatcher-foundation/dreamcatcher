// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Math } from "../../imports/openzeppelin/utils/math/Math.sol";

library FixedPointMath {
    using FixedPointMath for uint256;
    using Math for uint256;
    
    function loss(uint256 a, uint256 b) internal pure returns (uint256 percentage) {
        uint256 oneHundredPercent = 100 ether;
        return oneHundredPercent.sub(a.yield(b));
    }

    function yield(uint256 a, uint256 b) internal pure returns (uint256 percentage) {
        return
            a == 0 ? 0 :
            a >= b ? 100 ether :
            a.percentageOf(b);
    }

    function percentageOf(uint256 a, uint256 b) internal pure returns (uint256 percentage) {
        return a.div(b).mul(100 ether);
    }

    function slice(uint256 x, uint256 percentage) internal pure returns (uint256) {
        return x.div(100 ether).mul(percentage);
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        unchecked {
            uint256 c = a + b;
            require(c >= a, "UINT_OVERF");
            return c;
        }
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        unchecked {
            require(b <= a, "UINT_UNDER");
            return a - b;
        }
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a.muldiv(b, 1 ether);
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return a.muldiv(1 ether, b);
    }

    function cast(uint256 x, uint8 decimals0, uint8 decimals1) internal pure returns (uint256) {
        require(decimals0 >= 2 && decimals1 >= 2 && decimals0 <= 18 && decimals1 <= 18, "DECIMALS_OUT_OF_BOUNDS");
        return (x == 0 || decimals0 == decimals1) ? x : x.muldiv(10**decimals1, 10**decimals0);
    }

    function muldiv(uint256 a, uint256 b, uint256 c) internal pure returns (uint256) {
        return c == 0 ? 0 : a.mulDiv(b, c);
    }
}