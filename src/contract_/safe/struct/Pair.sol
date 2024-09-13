// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IToken} from "../asset/token/IToken.sol";
import {IUniswapV2Pair} from "../import/uniswap/v2/interfaces/IUniswapV2Pair.sol";

struct Pair {
    IUniswapV2Pair pair;
    IToken token0;
    IToken token1;
    uint256 reserve0;
    uint256 reserve1;
    uint8 decimals0;
    uint8 decimals1;
}