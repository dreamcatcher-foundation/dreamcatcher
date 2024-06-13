// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IERC20 } from "../import/openzeppelin/token/ERC20/IERC20.sol";
import { UniswapV2MarketAdaptorLib } from "./UniswapV2MarketAdaptorLib.sol";
import { FixedPointValueMathLib } from "./FixedPointValueMathLib.sol";
import { UniswapV2MarketLib } from "./UniswapV2MarketLib.sol";
import { UniswapV2PathLib } from "./UniswapV2PathLib.sol";
import { UniswapV2Market } from "../struct/UniswapV2Market.sol";
import { FixedPointValue } from "../struct/FixedPointValue.sol";

library UniswawpV2MarketSwapperLib {
    using UniswapV2MarketLib for UniswapV2Market;
    using UniswapV2MarketAdaptorLib for UniswapV2Market;
    using FixedPointValueMathLib for FixedPointValue;
    using UniswapV2PathLib for address[];

    error InsufficientYield();

    function swap(UniswapV2Market memory uniswapV2Market, address[] memory path, FixedPointValue memory amountIn, FixedPointValue memory minYield) internal returns (FixedPointValue memory asEther) {
        if (uniswapV2Market.yield(path, amountIn).value < minYield.toEther().value) {
            revert InsufficientYield();
        }
        IERC20(path.token0()).approve(address(uniswapV2Market.router()), 0);
        IERC20(path.token0()).approve(address(uniswapV2Market.router()), amountIn.toNewDecimals(path.decimals0()).value);
        uint256[] memory amounts = uniswapV2Market.router().swapExactTokensForTokens(amountIn.toNewDecimals(path.decimals0()).value, uniswapV2Market.realAmountOut(path, amountIn).toEther().value, path, msg.sender, block.timestamp);
        uint256 amount = amounts[amounts.length - 1];
        return FixedPointValue({ value: amount, decimals: path.decimals1() }).toEther();
    }
}