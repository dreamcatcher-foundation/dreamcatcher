// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IUniswapV2Router02} from "../import/uniswap/v2/interfaces/IUniswapV2Router02.sol";
import {IUniswapV2Factory} from "../import/uniswap/v2/interfaces/IUniswapV2Factory.sol";
import {IUniswapV2Pair} from "../import/uniswap/v2/interfaces/IUniswapV2Pair.sol";
import {IToken} from "../asset/token/IToken.sol";
import {IOwnableToken} from "../asset/token/ownable/IOwnableToken.sol";
import {OwnableTokenController} from "./OwnableTokenController.sol";
import {FixedPointMathEngine} from "./FixedPointMathEngine.sol";
import {Asset} from "./Asset.sol";
import {Quote} from "./Quote.sol";
import {Pair} from "./Pair.sol";
import {Side} from "./Side.sol";

contract Safe is OwnableTokenController, FixedPointMathEngine {

    event Mint(address indexed account, uint256 amountIn, uint256 amountOut, IToken tokenIn, IToken tokenOut);
    event Burn(address indexed account, uint256 amountIn, uint256 amountOut, IToken tokenIn, IToken tokenOut);


}