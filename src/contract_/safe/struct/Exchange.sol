// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IUniswapV2Router02} from "../../import/uniswap/v2/interfaces/IUniswapV2Router02.sol";
import {IUniswapV2Factory} from "../../import/uniswap/v2/interfaces/IUniswapV2Factory.sol";

struct Exchange {
    IUniswapV2Router02 router;
    IUniswapV2Factory factory;
}