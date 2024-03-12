// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import '../../non-native/uniswap/interfaces/IUniswapV2Factory.sol';
import '../../non-native/uniswap/interfaces/IUniswapV2Router02.sol';
import '../../non-native/uniswap/interfaces/IUniswapV2Pair.sol';
import '../../non-native/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol';
import '../../non-native/openzeppelin/token/ERC20/IERC20.sol';
import './ConversionLibrary.sol';
import './ERC20AddressAdaptorLibrary.sol';

library UniswapV2PairLibrary {
    using ConversionLibrary for uint256;
    using ERC20AddressAdaptorLibrary for address;

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

    function quote(address token0, address token1, address uniswapV2Factory, address uniswapV2Router02) internal view returns (uint256 asNative) {
        if (isZeroV2PairAddress(token0, token1, uniswapV2Factory)) {
            return 0;
        }
        if (isSameLayoutAsV2PairInterface(token0, token1, uniswapV2Factory)) {
            return IUniswapV2Router02(uniswapV2Router02)
                .quote(
                    10**token0.decimals();,
                    reserves(token0, token1, uniswapV2Factory)[0],
                    reserves(token0, token1, uniswapV2Factory)[1]
                )
                .asNative(token1.decimals());
        }
        return IUniswapV2Router02(uniswapV2Router02)
            .quote(
                10**token1.decimals(),
                reserves(token0, token1, uniswapV2Factory)[1],
                reserves(token0, token1, uniswapV2Factory)[0]
            )
            .asNative(token1.decimals());
    }

    function out(address[] memory path, address uniswapV2Factory, address uniswapV2Router02, uint256 amountAsNative) internal view returns (uint256 asNative) {
        uint256[] memory amounts = IUniswapV2Router02(uniswapV2Router02).getAmountsOut(amountAsNative.asNonNative(path[0].decimals()), path);
        return amounts[amounts.length - 1].asNative(path[path.length - 1].decimals());
    }

    function slippage(address[] memory path, address uniswapV2Factory, address uniswapV2Router02, uint256 amountAsNative) internal view returns (uint256 asBasisPoint) {
        uint256 quoteAsNative = quote(path[0], path[path.length - 1], uniswapV2Factory, uniswapV2Router02);
        uint256 bestAmountOutAsNative = amountAsNative * quoteAsNative;
        uint256 realAmountOutAsNative = out(path, uniswapV2Factory, uniswapV2Router02, amountAsNative);
        return ((realAmountOutAsNative - bestAmountOutAsNative) / bestAmountOutAsNative) * 10000;
    }

    function swap(address[] memory path, address uniswapV2Factory, address uniswapV2Router02, uint256 amountAsNative) internal returns (uint256 asNative) {
        IERC20 token = IERC20(path[0]);
        path[0].approve(uniswapV2Router02, 0);
        path[0].approve(uniswapV2Router02, amountAsNative);
        uint256[] memory amounts = IUniswapV2Router02(uniswapV2Router02).swapExactTokensForTokens(amountAsNative.asNonNative(path[0].decimals()), out(path, uniswapV2Factory, uniswapV2Router02, amountAsNative).asNonNative(path[path.length - 1].decimals()), path, msg.sender, block.timestamp);
        path[0].approve(uniswapV2Router02, 0);
        return amounts[amounts.length - 1].asNative(path[path.length - 1].decimals());
    }

    function swapWithMaximumSlippageRequirement(address[] memory path, address uniswapV2Factory, address uniswapV2Router02, uint256 amountAsNative, uint256 maximumSlippageAsBasisPoint) internal returns (uint256 asNative) {
        require(slippage(path, uniswapV2Factory, uniswapV2Router02, amountAsNative) <= maximumSlippageAsBasisPoint, 'UniswapV2PairLibrary: maximum slippage exceeded');
        return swap(path, uniswapV2Factory, uniswapV2Router02, amountAsNative);
    }
}