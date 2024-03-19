// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import "../../../non-native/uniswap/interfaces/IUniswapV2Pair.sol";
import "./UniswapV2AdaptorLibrary.sol";


contract TestableUniswapV2AdaptorLibrary {
    function price(address token0, address token1, address factory, address router) external view returns (uint256) {
        return UniswapV2AdaptorLibrary.price(token0, token1, factory, router);
    }

    function amountOut(address[] memory path, address factory, address router, uint256 amountNIn) external view returns (uint256) {
        return UniswapV2AdaptorLibrary.amountOut(path, factory, router, amountNIn);
    }


    function yield(address[] memory path, address factory, address router, uint256 amountNIn) external view returns (uint256) {
        return UniswapV2AdaptorLibrary.yield(path, factory, router, amountNIn);
    }


    function swapExactTokensForTokens(address[] memory path, address factory, address router, uint256 amountNIn) external returns (uint256) {
        return UniswapV2AdaptorLibrary.swapExactTokensForTokens(path, factory, router, amountNIn);
    }

    function swapExactTokensForTokensForMinYield(address[] memory path, address factory, address router, uint256 minYieldBPS) external returns (uint256) {
        return UniswapV2AdaptorLibrary.swapExactTokensForTokensForMinYield(path, factory, router, minYieldBPS);
    }


    function buy(address token, address asset, address factory, address router, uint256 amountNIn) external returns (uint256) {
        return UniswapV2AdaptorLibrary.buy(token, asset, factory, router, amountNIn);
    }

    function sell(address token, address asset, address factory, address router, uint256 amountNIn) external returns (uint256) {
        return UniswapV2AdaptorLibrary.sell(token, asset, factory, router, amountNIn);
    }


    function buyForMinYield(address token, address asset, address factory, address router, uint256 amountNIn, uint256 minYieldBPS) external returns (uint256) {
        return UniswapV2AdaptorLibrary.buyForMinYield(token, asset, factory, router, amountNIn, minYieldBPS);
    }

    function sellForMinYield(address token, address asset, address factory, address router, uint256 amountNIn, uint256 minYieldBPS) external returns (uint256) {
        return UniswapV2AdaptorLibrary.sellForMinYield(token, asset, factory, router, amountNIn, minYieldBPS);
    }


    function pairAddress(address token0, address token1, address factory) external view returns (address) {
        return UniswapV2AdaptorLibrary.pairAddress(token0, token1, factory);
    }

    function pairInterface(address token0, address token1, address factory) external view returns (IUniswapV2Pair) {
        return UniswapV2AdaptorLibrary.pairInterface(token0, token1, factory);
    }

    function pairReserves(address token0, address token1, address factory) external view returns (uint256[] memory) {
        return UniswapV2AdaptorLibrary.pairReserves(token0, token1, factory);
    }

    function pairIsZeroAddress(address token0, address token1, address factory) external view returns (bool) {
        return UniswapV2AdaptorLibrary.pairIsZeroAddress(token0, token1, factory);
    }

    function pairIsSameLayoutAsGivenTokens(address token0, address token1, address factory) external view returns (bool) {
        return UniswapV2AdaptorLibrary.pairIsSameLayoutAsGivenTokens(token0, token1, factory);
    }
}