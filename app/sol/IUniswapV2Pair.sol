// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import { FixedPointValue } from "./libraries/fixedPoint/FixedPointValue.sol";

interface IPair {
    
    function targetAllocation
    function allocation
    function access(uint256 totalAssets) external view returns (uint256);
    function deficit() external view returns (uint256);
    function optimalAssetValue() external view returns (FixedPointValue memory r18);
    function actualAssetValue() external view returns (FixedPointValue memory r18);
    function yield(FixedPointValue memory amountIn) external view returns (FixedPointValue memory bpR18);
    function optimalAmountOut(FixedPointValue memory amountIn) external view returns (FixedPointValue memory r18);
    function actualAmountOut(FixedPointValue memory amountIn) external view returns (FixedPointValue memory r18);
    function quote() external view returns (FixedPointValue memory r18);
    function sell(FixedPointValue memory amountIn) external returns (bool);
    function buy(FixedPointValue memory amountIn) external returns (bool);
}