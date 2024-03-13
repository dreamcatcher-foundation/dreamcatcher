// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../adaptor/UniswapV2PairAdaptorLib.sol";

library TradeActionLib {
    struct TradePayload {
        address token;
        address asset;
        address uniswapV2Factory;
        address uniswapV2Router;
        uint amountInR64;
    }

    /**
     * @dev Executes a buy trade on Uniswap V2 pair.
     * @param payload The payload containing trade details.
     * @return r64 The amount of tokens received in Dreamcatcher native r64 representation.
     */
    function buy(TradePayload payload) internal returns (uint r64) {
        address[] memory path = new address[](2);
        path[0] = payload.asset;
        path[1] = payload.token;
        UniswapV2PairLibrary.PathPayload swapPayload;
        swapPayload.path = path;
        swapPayload.uniswapV2Factory = payload.uniswapV2Factory;
        swapPayload.uniswapV2Router = payload.uniswapV2Router;
        swapPayload.amountInR64 = payload.amountInR64;
        return UniswapV2PairLibrary.swap(swapPayload);
    }

    /**
     * @dev Executes a sell trade on Uniswap V2 pair.
     * @param payload The payload containing trade details.
     * @return r64 The amount of tokens received in Dreamcatcher native r64 representation.
     */
    function sell(TradePayload payload) internal returns (uint r64) {
        address[] memory path = new address[](2);
        path[0] = payload.token;
        path[1] = payload.asset;
        UniswapV2PairLibrary.PathPayload swapPayload;
        swapPayload.path = path;
        swapPayload.uniswapV2Factory = payload.uniswapV2Factory;
        swapPayload.uniswapV2Router = payload.uniswapV2Router;
        swapPayload.amountInR64 = payload.amountInR64;
        return UniswapV2PairLibrary.swap(swapPayload);
    }

    struct TradeWithSlippagePayload {
        address token;
        address asset;
        address uniswapV2Factory;
        address uniswapV2Router;
        uint amountInR64;
        uint maximumSlippageAsBasisPoint;
    }

    /**
     * @dev Executes a buy trade with slippage check on Uniswap V2 pair.
     * @param payload The payload containing trade details and maximum slippage.
     * @return r64 The amount of tokens received in Dreamcatcher native r64 representation.
     */
    function buyWithSlippageCheck(TradeWithSlippagePayload payload) internal returns (uint r64) {
        address[] memory path = new address[](2);
        path[0] = payload.asset;
        path[1] = payload.token;
        UniswapV2PairLibrary.PathWithSlippagePayload swapPayload;
        swapPayload.path = path;
        swapPayload.uniswapV2Factory = payload.uniswapV2Factory;
        swapPayload.uniswapV2Router = payload.uniswapV2Router;
        swapPayload.amountInR64 = payload.amountInR64;
        swapPayload.maximumSlippageAsBasisPoint = payload.maximumSlippageAsBasisPoint;
        return UniswapV2PairLibrary.swapWithSlippageCheck(swapPayload);
    }

    /**
     * @dev Executes a sell trade with slippage check on Uniswap V2 pair.
     * @param payload The payload containing trade details and maximum slippage.
     * @return r64 The amount of tokens received in Dreamcatcher native r64 representation.
     */
    function sellWithSlippageCheck(TradeWithSlippagePayload payload) internal returns (uint r64) {
        address[] memory path = new address[](2);
        path[0] = payload.token;
        path[1] = payload.asset;
        UniswapV2PairLibrary.PathWithSlippagePayload swapPayload;
        swapPayload.path = path;
        swapPayload.uniswapV2Factory = payload.uniswapV2Factory;
        swapPayload.uniswapV2Router = payload.uniswapV2Router;
        swapPayload.amountInR64 = payload.amountInR64;
        swapPayload.maximumSlippageAsBasisPoint = payload.maximumSlippageAsBasisPoint;
        return UniswapV2PairLibrary.swapWithSlippageCheck(swapPayload);
    }
}