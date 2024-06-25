// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Pair } from "./Pair.sol";
import { Quote } from "./Quote.sol";

interface IUniswapPriceFeed {
    function quote(address[] memory path, uint256 amountIn) external view returns (Quote memory);
    function pair(address token0, address token1) external view returns (Pair memory);
}