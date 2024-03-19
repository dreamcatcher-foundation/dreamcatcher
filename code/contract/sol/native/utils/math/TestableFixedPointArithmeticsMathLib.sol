// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import "./FixedPointArithmeticsMathLibrary.sol";

contract TestableFixedPointArithmeticsMathLibrary {
    function maximumRepresentableEntireValue(uint8 decimals) external pure returns (uint256) {
        return FixedPointArithmeticsMathLibrary.maximumRepresentableEntireValue(decimals);
    }

    function uint256Max() external pure returns (uint256) {
        return FixedPointArithmeticsMathLibrary.uint256Max();
    }

    
    function netAssetValue(uint256[] memory amounts, uint256[] memory prices) external pure returns (uint256) {
        return FixedPointArithmeticsMathLibrary.netAssetValue(amounts, prices);
    }

    function netAssetValuePerShare(uint256[] memory amounts, uint256[] memory prices, uint256 totalSupply) external pure returns (uint256) {
        return FixedPointArithmeticsMathLibrary.netAssetValuePerShare(amounts, prices, totalSupply);
    }


    function amountToMint(uint256 assetsNIn, uint256 netAssetValueN, uint256 totalSupplyN) external pure returns (uint256) {
        return FixedPointArithmeticsMathLibrary.amountToMint(assetsNIn, netAssetValueN, totalSupplyN);
    }

    function amountToSend(uint256 sharesNIn, uint256 netAssetValueN, uint256 totalSupplyN) external pure returns (uint256) {
        return FixedPointArithmeticsMathLibrary.amountToSend(sharesNIn, netAssetValueN, totalSupplyN);
    }


    function scale(uint256 value0, uint256 value1) external pure returns (uint256) {
        return FixedPointArithmeticsMathLibrary.scale(value0, value1);
    }

    function slice(uint256 value, uint256 sliceBPS) external pure returns (uint256) {
        return FixedPointArithmeticsMathLibrary.slice(value, sliceBPS);
    }


    function sum(uint256[] memory values) external pure returns (uint256) {
        return FixedPointArithmeticsMathLibrary.sum(values);
    }

    function max(uint256[] memory values) external pure returns (uint256) {
        return FixedPointArithmeticsMathLibrary.max(values);
    }

    function min(uint256[] memory values) external pure returns (uint256) {
        return FixedPointArithmeticsMathLibrary.min(values);
    }

    function avg(uint256[] memory values) external pure returns (uint256) {
        return FixedPointArithmeticsMathLibrary.avg(values);
    }


    function add(uint256 value0, uint256 value1) external pure returns (uint256) {
        return FixedPointArithmeticsMathLibrary.add(value0, value1);
    }

    function sub(uint256 value0, uint256 value1) external pure returns (uint256) {
        return FixedPointArithmeticsMathLibrary.sub(value0, value1);
    }

    function mul(uint256 value0, uint256 value1) external pure returns (uint256) {
        return FixedPointArithmeticsMathLibrary.mul(value0, value1);
    }

    function div(uint256 value0, uint256 value1) external pure returns (uint256) {
        return FixedPointArithmeticsMathLibrary.div(value0, value1);
    }

    function exp(uint256 value0, uint256 value1) external pure returns (uint256) {
        return FixedPointArithmeticsMathLibrary.exp(value0, value1);
    }


    function asNewR(uint256 valueR, uint8 oldDecimals, uint8 newDecimals) external pure returns (uint256) {
        return FixedPointArithmeticsMathLibrary.asNewR(valueR, oldDecimals, newDecimals);
    }

    function asN(uint256 valueR, uint8 oldDecimals) external pure returns (uint256) {
        return FixedPointArithmeticsMathLibrary.asN(valueR, oldDecimals);
    }

    function asR(uint256 valueN, uint8 newDecimals) external pure returns (uint256) {
        return FixedPointArithmeticsMathLibrary.asR(valueN, newDecimals);
    }
}