// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import '../../non-native/uniswap/interfaces/IUniswapV2Factory.sol';
import '../../non-native/uniswap/interfaces/IUniswapV2Router02.sol';
import '../../non-native/uniswap/interfaces/IUniswapV2Pair.sol';
import '../../non-native/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol';
import '../../non-native/openzeppelin/token/ERC20/IERC20.sol';
import './ConversionMathLibrary.sol';

library UniswapV2PairLibrary {
    using ConversionMathLibrary for uint256;

    function asV2PairAddress(address token0, address token1, address uniswapV2Factory) internal view returns (address) {
        return IUniswapV2Factory(uniswapV2Factory).getPair(token0, token1);
    }

    function asV2PairInterface(address token0, address token1, address uniswapV2Factory) internal view returns (IUniswapV2Pair) {
        return IUniswapV2Pair(asV2PairAddress(token0, token1, uniswapV2Factory));
    }

    function reserves(address token0, address token1, address uniswapV2Factory) internal view returns (uint256[] memory response) {
        response = new uint256[](2);
        (
            response[0],
            response[1],
        ) = asV2PairInterface(token0, token1, uniswapV2Factory).getReserves();
        return response;
    }

    function isZeroV2PairAddress(address token0, address token1, address uniswapV2Factory) internal view returns (bool) {
        return asV2PairAddress(token0, token1, uniswapV2Factory) == address(0);
    }

    function isSameLayoutAsV2PairInterface(address token0, address token1, address uniswapV2Factory) internal view returns (bool) {
        return token0 == asV2PairInterface(token0, token1, uniswapV2Factory).token0();
    }

    function quote(address token0, address token1, address uniswapV2Factory, address uniswapV2Router02) internal view returns (uint256 asEther) {
        if (isZeroV2PairAddress(token0, token1, uniswapV2Factory)) {
            return 0;
        }
        uint8 decimals0 = IERC20Metadata(token0).decimals();
        uint8 decimals1 = IERC20Metadata(token1).decimals();
        if (isSameLayoutAsV2PairInterface(token0, token1, uniswapV2Factory)) {
            return IUniswapV2Router02(uniswapV2Router02)
                .quote(
                    10**decimals0,
                    reserves(token0, token1, uniswapV2Factory)[0],
                    reserves(token0, token1, uniswapV2Factory)[1]
                )
                .fromNonNativeDecimalsToEther(decimals1);
        }
        return IUniswapV2Router02(uniswapV2Router02)
            .quote(
                10**decimals1,
                reserves(token0, token1, uniswapV2Factory)[1],
                reserves(token0, token1, uniswapV2Factory)[0]
            )
            .fromNonNativeDecimalsToEther(decimals1);
    }

    function out(address[] memory path, address uniswapV2Factory, address uniswapV2Router02, uint256 amountAsEther) internal view returns (uint256 asEther) {
        uint8 decimals0 = IERC20Metadata(path[0]).decimals();
        uint8 decimals1 = IERC20Metadata(path[path.length - 1]).decimals();
        uint256[] memory amounts = IUniswapV2Router02(uniswapV2Router02)
            .getAmountsOut(
                amountAsEther.fromEtherToNonNativeDecimals(decimals0),
                path
            );
        return amounts[amounts.length - 1].fromNonNativeDecimalsToEther(decimals1);
    }

    function swap(address[] memory path, address uniswapV2Factory, address uniswapV2Router02, uint256 amountAsEther) internal returns (uint256 asEther) {
        IERC20 token = IERC20(path[0]);
        uint8 decimals0 = IERC20Metadata(path[0]).decimals();
        uint8 decimals1 = IERC20Metadata(path[path.length - 1]).decimals();
        uint256 amount = amountAsEther.fromEtherToNonNativeDecimals(decimals0);
        token.approve(uniswapV2Router02, 0);
        token.approve(uniswapV2Router02, amount);
        uint256[] memory amounts = IUniswapV2Router02(uniswapV2Router02).swapExactTokensForTokens(
            amount,
            out(path, uniswapV2Factory, uniswapV2Router02, amountAsEther).fromEtherToNonNativeDecimals(decimals1),
            path,
            msg.sender,
            block.timestamp
        );
        token.approve(uniswapV2Router02, 0);
        return amounts[amounts.length - 1].fromNonNativeDecimalsToEther(decimals1);
    }
}