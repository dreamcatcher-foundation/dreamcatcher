// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IERC20 } from "../import/openzeppelin/token/ERC20/IERC20.sol";
import { IERC20Metadata } from "../import/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { IUniswapV2Pair } from "../import/uniswap/interfaces/IUniswapV2Pair.sol";
import { IUniswapV2Router02 } from "../import/uniswap/interfaces/IUniswapV2Router02.sol";
import { IUniswapV2Factory } from "../import/uniswap/interfaces/IUniswapV2Factory.sol";
import { UniswapV2PathLib } from "./UniswapV2PathLib.sol";
import { UniswapV2MarketLib } from "./UniswapV2MarketLib.sol";
import { UniswapV2Market } from "../struct/UniswapV2Market.sol";
import { PairLayout } from "../enum/PairLayout.sol";

library UniswapV2MarketAdaptorLib {
    using UniswapV2PathLib for address[];
    using UniswapV2MarketLib for UniswapV2Market;

    error PairNotFound();

    function toPairLayout(UniswapV2Market memory uniswapV2Market) {
        if (
            path.token0() == uniswapV2Market.toPair(path).token0() &&
            path.token1() == uniswapV2Market.toPair(path).token1()
        ) {
            return PairLayout.IsMatch;
        }
        if (
            path.token0() == uniswapV2Market.toPair(path).token1() &&
            path.token1() == uniswapV2Market.toPair(path).token0()
        ) {
            return PairLayout.IsReverseMatch;
        }
        return PairLayout.IsNotMatch;
    }

    function onlyIfHasPair(UniswapV2Market memory uniswapV2Market, address[] memory path) internal view returns (bool) {
        if (!hasPair(uniswapV2Market, path)) {
            revert PairNotFound();
        }
        return true;
    }

    function hasPair(UniswapV2Market memory uniswapV2Market, address[] memory path) internal view returns (bool) {
        path.onlyValidPath(path);
        return uniswapV2Market.pairAddressOf(path) != address(0);
    }

    function reserveOf(UniswapV2Market memory uniswapV2Market, address[] memory path) internal view returns (uint256[] memory) {
        uint256[] memory reserve = new uint256[](2);
        (
            reserve[0],
            reserve[1],
        ) = uniswapV2Market.toPair(path).getReserves();
        return reserve;
    }

    function toPair(UniswapV2Market memory uniswapV2Market, address[] memory path) internal view returns (IUniswapV2Pair memory) {
        path.onlyValidPath();
        onlyIfHasPair(uniswapV2Market, path);
        return IUniswapV2Pair(uniswapV2Market.pairAddressOf(path));
    }

    function pairAddressOf(UniswapV2Market memory uniswapV2Market, address[] memory path) internal view returns (address) {
        path.onlyValidPath();
        return uniswapV2Market
            .toFactory()
            .getPair(
                path.token0(), 
                path.token1()
            );
    }
}