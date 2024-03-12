// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import '../util/UniswapV2PairLibrary.sol';

contract UniswapV2PairLibraryMockInterface {
    function asV2PairAddress(address token0, address token1, address uniswapV2Factory) external view returns (address) {
        return UniswapV2PairLibrary.asV2PairAddress(token0, token1, uniswapV2Factory);
    }

    function asV2PairInterface(address token0, address token1, address uniswapV2Factory) external view returns (IUniswapV2Pair) {
        return UniswapV2PairLibrary.asV2PairInterface(token0, token1, uniswapV2Factory);
    }

    function reserves(address token0, address token1, address uniswapV2Factory) external view returns (uint256[] memory response) {
        return UniswapV2PairLibrary.reserves(token0, token1, uniswapV2Factory);
    }

    function isZeroV2PairAddress(address token0, address token1, address uniswapV2Factory) external view returns (bool) {
        return UniswapV2PairLibrary.isZeroV2PairAddress(token0, token1, uniswapV2Factory);
    }

    function isSameLayoutAsV2PairInterface(address token0, address token1, address uniswapV2Factory) external view returns (bool) {
        return UniswapV2PairLibrary.isSameLayoutAsV2PairInterface(token0, token1, uniswapV2Factory);
    }

    function quote(address token0, address token1, address uniswapV2Factory, address uniswapV2Router02) external view returns (uint256 asEther) {
        return UniswapV2PairLibrary.quote(token0, token1, uniswapV2Factory, uniswapV2Router02);
    }

    function out(address[] memory path, address uniswapV2Factory, address uniswapV2Router02, uint256 amountAsEther) external view returns (uint256 asEther) {
        return UniswapV2PairLibrary.out(path, uniswapV2Factory, uniswapV2Router02, amountAsEther);
    }

    function swap(address[] memory path, address uniswapV2Factory, address uniswapV2Router02, uint256 amountAsEther) external returns (uint256 asEther) {
        return UniswapV2PairLibrary.swap(path, uniswapV2Factory, uniswapV2Router02, amountAsEther);
    }
}