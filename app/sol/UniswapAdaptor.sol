// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IERC20 } from "./imports/openzeppelin/token/ERC20/IERC20.sol";
import { IERC20Metadata } from "./imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { IUniswapV2Router02 } from "./imports/uniswap/interfaces/IUniswapV2Router02.sol";
import { IUniswapV2Factory } from "./imports/uniswap/interfaces/IUniswapV2Factory.sol";
import { IUniswapV2Pair } from "./imports/uniswap/interfaces/IUniswapV2Pair.sol";
import { Pair } from "./Pair.sol";
import { QuoteResult } from "./QuoteResult.sol";
import { BalanceQueryResult } from "./BalanceQueryResult.sol";
import { FixedPointCalculator } from "./FixedPointCalculator.sol";
import { ThirdPartyBroker } from "./modifiers/ThirdPartyBroker.sol";
import { SwapRequest } from "./SwapRequest.sol";
import { Asset } from "./Asset.sol";

contract UniswapAdaptor is FixedPointCalculator, ThirdPartyBroker {
    event ThirdPartySwap(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);

    constructor() {}

    function getQuote(Pair memory pair, uint256 amountIn) public pure returns (QuoteResult memory) {
        require(pair.token0 != address(0) && pair.token1 != address(0) && pair.decimals0 != 0 && pair.decimals1 != 0 && pair.factory != address(0) && pair.router != address(0), "VOID_PAIR");
        require(pair.reserve0 != 0 && pair.reserve1 != 0, "INSUFFICIENT_LIQUIDITY");
        QuoteResult memory quoteResult;
        quoteResult.amountIn = amountIn;
        quoteResult.quote = _quote(amountIn, pair.reserve0, pair.reserve1, pair.router);
        quoteResult.out = _out(amountIn, pair.reserve0, pair.reserve1, pair.router);
        quoteResult.slippage = _slippage(quoteResult.out, quoteResult.quote);
        return quoteResult;
    }

    function getBalanceSheet(Pair memory pair, uint256 targetWeight, uint256 totalAssets) public view returns (BalanceQueryResult memory) {
        BalanceQueryResult memory balanceQueryResult;
        balanceQueryResult.targetWeight = targetWeight;
        balanceQueryResult.totalAssets = totalAssets;
        balanceQueryResult.actualBalance = _cast(IERC20(pair.token0).balanceOf(address(msg.sender)), IERC20Metadata(pair.token0).decimals(), 18);
        QuoteResult memory quoteResult = getQuote(pair, balanceQueryResult.actualBalance);
        balanceQueryResult.actualValue = quoteResult.quote;
        balanceQueryResult.actualWeight = _mul(_div(balanceQueryResult.actualValue, balanceQueryResult.totalAssets), 100 ether);
        balanceQueryResult.targetValue = _mul(_div(balanceQueryResult.totalAssets, 100 ether), balanceQueryResult.targetWeight);
        Asset memory asset;
        asset.factory = pair.factory;
        asset.router = pair.router;
        asset.token0 = pair.token1;
        asset.token1 = pair.token0;
        Pair memory reversePair = getPair(asset);
        QuoteResult memory reverseQuoteResult = getQuote(reversePair, balanceQueryResult.targetValue);
        balanceQueryResult.targetBalance = reverseQuoteResult.quote;
        balanceQueryResult.surplusBalance = 
            balanceQueryResult.actualBalance > balanceQueryResult.targetBalance
                ? _sub(balanceQueryResult.actualBalance, balanceQueryResult.targetBalance)
                : 0;
        balanceQueryResult.deficitBalance =
            balanceQueryResult.actualBalance < balanceQueryResult.targetBalance
                ? _sub(balanceQueryResult.targetBalance, balanceQueryResult.actualBalance)
                : 0;
        balanceQueryResult.surplusValue =
            balanceQueryResult.actualValue > balanceQueryResult.targetValue
                ? _sub(balanceQueryResult.actualValue, balanceQueryResult.targetValue)
                : 0;
        balanceQueryResult.deficitValue =
            balanceQueryResult.actualValue < balanceQueryResult.targetValue
                ? _sub(balanceQueryResult.targetValue, balanceQueryResult.actualValue)
                : 0;
        return balanceQueryResult;
    }

    function getPair(Asset memory asset) public view returns (Pair memory) {
        require(asset.factory != address(0) && asset.router != address(0) && asset.token0 != address(0) && asset.token1 != address(0), "VOID_ASSET");
        require(IUniswapV2Factory(asset.factory).getPair(asset.token0, asset.token1) != address(0), "PAIR_NOT_FOUND");
        Pair memory pair;
        pair.factory = asset.factory;
        pair.router = asset.router;
        pair.token0 = asset.token0;
        pair.token1 = asset.token1;
        pair.decimals0 = IERC20Metadata(pair.token0).decimals();
        pair.decimals1 = IERC20Metadata(pair.token1).decimals();
        address pairAddr = IUniswapV2Factory(pair.factory).getPair(pair.token0, pair.token1);
        pair.addr = pairAddr;
        IUniswapV2Pair pairIntf = IUniswapV2Pair(pairAddr);
        (uint112 reserve0, uint112 reserve1,) = pairIntf.getReserves();
        address pairToken0 = pairIntf.token0();
        pair.reserve0 = pair.token0 == pairToken0
            ? uint112(_cast(reserve0, pair.decimals0, 18)) 
            : uint112(_cast(reserve1, pair.decimals0, 18));
        pair.reserve1 = pair.token0 == pairToken0
            ? uint112(_cast(reserve1, pair.decimals1, 18))
            : uint112(_cast(reserve0, pair.decimals1, 18));  
        return pair;
    }

    function swap(SwapRequest memory request) public thirdPartySwap(request.tokenIn, request.amountIn, request.router) returns (uint256) {
        require(request.factory != address(0) && request.router != address(0) && request.tokenIn != address(0) && request.tokenOut != address(0) && request.amountIn != 0, "UniswapEngine: VOID_SWAP_REQUEST");
        Asset memory asset;
        asset.token0 = request.tokenIn;
        asset.token1 = request.tokenOut;
        asset.factory = request.factory;
        asset.router = request.router;
        QuoteResult memory quoteResult = getQuote(getPair(asset), request.amountIn);
        require(quoteResult.amountIn != 0 && quoteResult.quote != 0 && quoteResult.out != 0 && quoteResult.slippage != 0, "UniswapEngine: VOID_QUOTE_RESULT");
        require(quoteResult.slippage <= request.slippageThreshold, "UniswapEngine: SLIPPAGE_EXCEEDS_THRESHOLD");
        address[] memory path = new address[](2);
        path[0] = request.tokenIn;
        path[1] = request.tokenOut;
        uint8 decimals = IERC20Metadata(request.tokenIn).decimals();
        uint256 amountInN = _cast(request.amountIn, 18, decimals);
        uint256[] memory amountsN = IUniswapV2Router02(request.router).swapExactTokensForTokens(amountInN, 0, path, msg.sender, block.timestamp);
        uint256 outN = amountsN[amountsN.length - 1];
        uint256 out = _cast(outN, decimals, 18);
        emit ThirdPartySwap(request.tokenIn, request.tokenOut, request.amountIn, out);
        return out;
    }

    function _slippage(uint256 out, uint256 quote) private pure returns (uint256) {
        return
            out == 0 && quote != 0
                ? 0 :
            out != 0 && quote == 0
                ? 100 ether :
            out == 0 && quote == 0
                ? 100 ether :
            out > quote
                ? 100 ether :
            _loss(out, quote);
    }

    function _quote(uint256 amountIn, uint256 reserve0, uint256 reserve1, address router) private pure returns (uint256) {
        return
            amountIn == 0
                ? 0 :
            reserve0 == 0 || 
            reserve1 == 0
                ? 0 :
            IUniswapV2Router02(router).quote(amountIn, reserve0, reserve1);
    }

    function _out(uint256 amountIn, uint256 reserve0, uint256 reserve1, address router) private pure returns (uint256) {
        return
            amountIn == 0
                ? 0 :
            reserve0 == 0 || 
            reserve1 == 0
                ? 0 :
            IUniswapV2Router02(router).getAmountOut(amountIn, reserve0, reserve1);
    }
}