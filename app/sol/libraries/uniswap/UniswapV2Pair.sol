// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IUniswapV2Factory } from "../../imports/uniswap/interfaces/UniswapV2Factory.sol";
import { IUniswapV2Router02 } from "../../imports/uniswap/interfaces/UniswapV2Router02.sol";

struct UniswapV2Pair {
    address[] path;
    IUniswapV2Router02 router;
    IUniswapV2Factory factory;
}