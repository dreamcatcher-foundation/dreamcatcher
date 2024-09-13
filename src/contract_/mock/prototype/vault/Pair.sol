// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IErc20 } from "../../../interface/standard/IErc20.sol";
import { IUniswapV2Pair } from "../../../import/uniswap/v2/interfaces/IUniswapV2Pair.sol";

struct Pair {
    IUniswapV2Pair pair;
    IErc20 token0;
    IErc20 token1;
    uint256 reserve0;
    uint256 reserve1;
    uint8 decimals0;
    uint8 decimals1;
}