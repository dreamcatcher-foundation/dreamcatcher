// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IUniswapV2Router02 } from "./imports/uniswap/interfaces/IUniswapV2Router02.sol";
import { IUniswapV2Factory } from "./imports/uniswap/interfaces/IUniswapV2Factory.sol";
import { IUniswapV2Pair } from "./imports/uniswap/interfaces/IUniswapV2Pair.sol";
import { IERC20 } from "./imports/openzeppelin/token/ERC20/IERC20.sol";
import { IERC20Metadata } from "./imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { FixedPointEngine } from "./FixedPointEngine.sol";

contract UniswapEngine is FixedPointEngine {
    event Swap(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);

    enum UniswapEngineResult {
        OK,
        INSUFFICIENT_LIQUIDITY,
        INSUFFICIENT_INPUT_AMOUNT,
        ADDRESS_NOT_FOUND,
        MISSING_REQUIRED_DATA,
        SLIPPAGE_EXCEEDS_THRESHOLD,
        INSUFFICIENT_BALANCE
    }

    struct SwapRequest {
        Exchange exchange;
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 slippageThreshold;
    }

    struct Pair {
        UniswapEngineResult result;
        /***/Exchange exchange;
        /***/address token0;
        /***/address token1;
        uint8 decimals0;
        uint8 decimals1;
        uint256 amountIn0; /** If `0` defaults to 1 ether */
        uint256 amountIn1; /** If `0` defaults to 1 ether */
        uint256 reserve0; /** uint112 */
        uint256 reserve1; /** uint112 */
        Quote quote0;
        Quote quote1;
        AmountOut amountOut0;
        AmountOut amountOut1;
        Slippage slippage0;
        Slippage slippage1;
    }

    struct Exchange {
        address factory;
        address router;
    }

    struct Quote {
        UniswapEngineResult result;
        uint256 value;
    }

    struct AmountIn {
        UniswapEngineResult result;
        uint256 value;
    }

    struct AmountOut {
        UniswapEngineResult result;
        uint256 value;
    }

    struct Slippage {
        UniswapEngineResult result;
        uint256 percentage;
    }

    function _fetchPairData(Pair memory pair) internal view returns (Pair memory) {
        pair.amountIn0 = pair.amountIn0 == 0 
            ? 1 ether : 
        pair.amountIn0;
        pair.amountIn1 = pair.amountIn1 == 0
            ? 1 ether :
        pair.amountIn1;
        if (pair.token0 == address(0) || pair.token1 == address(0) || pair.exchange.factory == address(0) || pair.exchange.router == address(0)) {
            pair.result = UniswapEngineResult.MISSING_REQUIRED_DATA;
            pair.quote0.result = pair.result;
            pair.quote1.result = pair.result;
            pair.amountOut0.result = pair.result;
            pair.amountOut1.result = pair.result;
            pair.slippage0.result = pair.result;
            pair.slippage1.result = pair.result;
            return pair;
        }
        uint8 token0Decimals = IERC20Metadata(pair.token0).decimals();
        uint8 token1Decimals = IERC20Metadata(pair.token1).decimals();
        address pair_ = IUniswapV2Factory(pair.exchange.factory).getPair(pair.token0, pair.token1);
        if (pair_ == address(0)) {
            pair.result = UniswapEngineResult.ADDRESS_NOT_FOUND;
            pair.decimals0 = IERC20Metadata(pair.token0).decimals();
            pair.decimals1 = IERC20Metadata(pair.token1).decimals();
            pair.quote0.result = pair.result;
            pair.quote1.result = pair.result;
            pair.amountOut0.result = pair.result;
            pair.amountOut1.result = pair.result;
            pair.slippage0.result = pair.result;
            pair.slippage1.result = pair.result;
            return pair;
        }
        (uint112 pairToken0Reserve, uint112 pairToken1Reserve,) = IUniswapV2Pair(pair_).getReserves();
        address pairToken0 = IUniswapV2Pair(pair_).token0();
        address pairToken1 = IUniswapV2Pair(pair_).token1();
        if (pair.token0 == pairToken0 && pair.token1 == pairToken1) {
            pair.result = UniswapEngineResult.OK;
            pair.decimals0 = IERC20Metadata(pair.token0).decimals();
            pair.decimals1 = IERC20Metadata(pair.token1).decimals();
            pair.reserve0 = _cast(pairToken0Reserve, token0Decimals, 18);
            pair.reserve1 = _cast(pairToken1Reserve, token1Decimals, 18);
            pair.quote0 = _quote(pair.amountIn0, pair.reserve0, pair.reserve1, pair.exchange.router);
            pair.quote1 = _quote(pair.amountIn1, pair.reserve1, pair.reserve0, pair.exchange.router);
            pair.amountOut0 = _amountOut(pair.amountIn0, pair.reserve0, pair.reserve1, pair.exchange.router);
            pair.amountOut1 = _amountOut(pair.amountIn1, pair.reserve1, pair.reserve0, pair.exchange.router);
            pair.slippage0 = _slippage(pair.amountOut0, pair.quote0);
            pair.slippage1 = _slippage(pair.amountOut1, pair.quote1);
            return pair;
        }
        else {
            pair.result = UniswapEngineResult.OK;
            pair.decimals0 = IERC20Metadata(pair.token0).decimals();
            pair.decimals1 = IERC20Metadata(pair.token1).decimals();
            pair.reserve0 = _cast(pairToken1Reserve, token0Decimals, 18);
            pair.reserve1 = _cast(pairToken0Reserve, token1Decimals, 18);
            pair.quote0 = _quote(pair.amountIn0, pair.reserve0, pair.reserve1, pair.exchange.router);
            pair.quote1 = _quote(pair.amountIn1, pair.reserve1, pair.reserve0, pair.exchange.router);
            pair.amountOut0 = _amountOut(pair.amountIn0, pair.reserve0, pair.reserve1, pair.exchange.router);
            pair.amountOut1 = _amountOut(pair.amountIn1, pair.reserve1, pair.reserve0, pair.exchange.router);
            pair.slippage0 = _slippage(pair.amountOut0, pair.quote0);
            pair.slippage1 = _slippage(pair.amountOut1, pair.quote1);
            return pair;
        }
    }

    function _swap(SwapRequest memory request) internal returns (uint256, UniswapEngineResult) {
        Pair memory pair;
        pair.exchange.factory = request.exchange.factory;
        pair.exchange.router = request.exchange.router;
        pair.token0 = request.tokenIn;
        pair.token1 = request.tokenOut;
        pair.amountIn0 = request.amountIn;
        pair = _fetchPairData(pair);
        if (pair.result != UniswapEngineResult.OK) {
            return (0, pair.result);
        }
        if (pair.slippage0.percentage > request.slippageThreshold) {
            return (0, UniswapEngineResult.SLIPPAGE_EXCEEDS_THRESHOLD);
        }
        uint256 balance = _cast(IERC20(pair.token0).balanceOf(address(this)), pair.decimals0, 18);
        if (pair.amountIn0 > balance) {
            return (0, UniswapEngineResult.INSUFFICIENT_BALANCE);
        }
        IERC20(pair.token0).approve(pair.exchange.router, 0);
        IERC20(pair.token0).approve(pair.exchange.router, _cast(pair.amountIn0, 18, pair.decimals0));
        address[] memory path = new address[](2);
        path[0] = pair.token0;
        path[1] = pair.token1;
        uint256[] memory amounts = IUniswapV2Router02(pair.exchange.router).swapExactTokensForTokens(_cast(pair.amountIn0, 18, pair.decimals0), 0, path, address(this), block.timestamp);
        uint256 amount = amounts[amounts.length - 1];
        uint256 amountOut = _cast(amount, pair.decimals0, 18);
        IERC20(pair.token0).approve(pair.exchange.router, 0);
        emit Swap(request.tokenIn, request.tokenOut, request.amountIn, amountOut);
        return (amountOut, UniswapEngineResult.OK);
    }

    function _slippage(AmountOut memory amountOut, Quote memory quote) private pure returns (Slippage memory) {
        Slippage memory slippage;
        if (quote.result != UniswapEngineResult.OK) {
            slippage.result = quote.result;
            return slippage;
        }
        if (amountOut.result != UniswapEngineResult.OK) {
            slippage.result = amountOut.result;
            return slippage;
        }
        if (amountOut.value > quote.value) {
            amountOut.value = quote.value;
        }
        slippage.result = UniswapEngineResult.OK;
        slippage.percentage = _loss(amountOut.value, quote.value);
        return slippage;
    }

    function _quote(uint256 token0AmountIn, uint256 token0Reserve, uint256 token1Reserve, address uniswapV2Router) private pure returns (Quote memory) {
        Quote memory quote;
        if (token0AmountIn == 0) {
            quote.result = UniswapEngineResult.INSUFFICIENT_INPUT_AMOUNT;
            return quote;
        }
        if (token0Reserve == 0 || token1Reserve == 0) {
            quote.result = UniswapEngineResult.INSUFFICIENT_LIQUIDITY;
            return quote;
        }
        quote.result = UniswapEngineResult.OK;
        quote.value = IUniswapV2Router02(uniswapV2Router).quote(token0AmountIn, token0Reserve, token1Reserve);
        return quote;
    }

    function _amountOut(uint256 token0AmountIn, uint256 token0Reserve, uint256 token1Reserve, address uniswapV2Router) private pure returns (AmountOut memory) {
        AmountOut memory amountOut;
        if (token0AmountIn == 0) {
            amountOut.result = UniswapEngineResult.INSUFFICIENT_INPUT_AMOUNT;
            amountOut.value = 0;
            return amountOut;
        }
        if (token0Reserve == 0 || token1Reserve == 0) {
            amountOut.result = UniswapEngineResult.INSUFFICIENT_LIQUIDITY;
            amountOut.value = 0;
            return amountOut;
        }
        amountOut.result = UniswapEngineResult.OK;
        amountOut.value = IUniswapV2Router02(uniswapV2Router).getAmountOut(token0AmountIn, token0Reserve, token1Reserve);
        return amountOut;
    }
}