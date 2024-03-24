// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import { Math } from "../../non-native/openzeppelin/utils/math/Math.sol";

contract FixedPointUtils {
    using Math for uint256;

    function _representation(uint8 decimals) internal pure returns (uint256) {
        return 10**decimals;
    }

    function _mulDiv(uint256 num0, uint256 num1, uint256 num2) internal pure returns (uint256) {
        return Math.mulDiv(num0, num1, num2);
    }
}