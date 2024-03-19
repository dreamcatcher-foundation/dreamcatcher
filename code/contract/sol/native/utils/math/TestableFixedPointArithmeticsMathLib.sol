// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import "./FixedPointArithmeticsMathLibrary.sol";

contract TestableFixedPointArithmeticsMathLibrary {
    function maximumRepresentableEntireValue(uint8 decimals) external pure returns (uint256 R_) {
        return FixedPointArithmeticsMathLibrary.maximumRepresentableEntireValue(decimals);
    }
}