// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IERC20 } from "../import/openzeppelin/token/ERC20/IERC20.sol";
import { IERC20Metadata } from "../import/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { IUniswapV2Pair } from "../import/uniswap/interfaces/IUniswapV2Pair.sol";
import { IUniswapV2Router02 } from "../import/uniswap/interfaces/IUniswapV2Router02.sol";
import { IUniswapV2Factory } from "../import/uniswap/interfaces/IUniswapV2Factory.sol";
import { UniswapV2PathLib } from "./UniswapV2PathLib.sol";
import { UniswapV2MarketLib } from "./UniswapV2MarketLib.sol";
import { FixedPointValueMathLib } from "./FixedPointValueMathLib.sol";
import { UniswapV2Market } from "../struct/UniswapV2Market.sol";
import { PairLayout } from "../enum/PairLayout.sol";
import { FixedPointValue } from "../struct/FixedPointValue.sol";

library UniswapV2MarketAdaptorLib {
    using UniswapV2PathLib for address[];
    using UniswapV2MarketLib for UniswapV2Market;
    using FixedPointValueMathLib for FixedPointValue;
    using UniswapV2MarketAdaptorLib for UniswapV2Market;

    error PairNotFound();

    function yield(UniswapV2Market memory uniswapV2Market, address[] memory path, FixedPointValue memory amountIn) internal view returns (FixedPointValue memory asBasisPoints) {
        return calculateYield(
            uniswapV2Market.bestAmountOut(path, amountIn), 
            uniswapV2Market.realAmountOut(path, amountIn)
        );
    }

    function bestAmountOut(UniswapV2Market memory uniswapV2Market, address[] memory path, FixedPointValue memory amountIn) internal view returns (FixedPointValue memory asEther) {
        return amountIn.toEther().mul(quote(uniswapV2Market, path)).toEther();
    }

    function realAmountOut(UniswapV2Market memory uniswapV2Market, address[] memory path, FixedPointValue memory amountIn) internal view returns (FixedPointValue memory asEther) {
        path.onlyValidPath();
        uint256[] memory amounts = uniswapV2Market.router().getAmountsOut(amountIn.toEther().value, path);
        uint256 amount = amounts[amounts.length - 1];
        return FixedPointValue({ value: amount, decimals: path.decimals1() }).toEther();
    }

    function quote(UniswapV2Market memory uniswapV2Market, address[] memory path) internal view returns (FixedPointValue memory) {
        uniswapV2Market.onlyAvailablePair(path);
        return calculateQuote(uniswapV2Market, path, uniswapV2Market.layoutOf(path));
    }

    function calculateQuote(UniswapV2Market memory uniswapV2Market, address[] memory path, PairLayout pairLayout) internal view returns (FixedPointValue memory) {
        path.onlyValidPath();
        if (pairLayout == PairLayout.IsMatch) {
            return quoteLayout0(uniswapV2Market, path);
        }
        if (pairLayout == PairLayout.IsReverseMatch) {
            return quoteLayout1(uniswapV2Market, path);
        }
        revert PairNotFound();
    }

    function quoteLayout0(UniswapV2Market memory uniswapV2Market, address[] memory path) private view returns (FixedPointValue memory asEther) {
        uint256 result
            = uniswapV2Market
                .router()
                .quote(
                    10 ** path.decimals0(),
                    reserveOf(uniswapV2Market, path)[0],
                    reserveOf(uniswapV2Market, path)[1]
                );
        return FixedPointValue({ value: result, decimals: path.decimals1() }).toEther();
    }

    function quoteLayout1(UniswapV2Market memory uniswapV2Market, address[] memory path) private view returns (FixedPointValue memory asEther) {
        uint256 result 
            = uniswapV2Market
                .router()
                .quote(
                    10 ** path.decimals1(),
                    reserveOf(uniswapV2Market, path)[1],
                    reserveOf(uniswapV2Market, path)[0]
                );
        return FixedPointValue({ value: result, decimals: path.decimals1() }).toEther();
    }

    function pairLayoutOf(UniswapV2Market memory uniswapV2Market, address[] memory path) internal view returns (PairLayout) {
        if (path.token0() == uniswapV2Market.pair(path).token0() && path.token1() == uniswapV2Market.pair(path).token1()) {
            return PairLayout.IsMatch;
        }
        if (path.token0() == uniswapV2Market.pair(path).token1() && path.token1() == uniswapV2Market.pair(path).token0()) {
            return PairLayout.IsReverseMatch;
        }
        return PairLayout.IsNotMatch;
    }

    function onlyAvailablePair(UniswapV2Market memory uniswapV2Market, address[] memory path) internal view returns (bool) {
        path.onlyValidPath(path);
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
        path.onlyValidPath(path);
        uint256[] memory reserve = new uint256[](2);
        (reserve[0], reserve[1],) 
            = uniswapV2Market
                .pairOf(path)
                .getReserves();
        return reserve;
    }

    function pairOf(UniswapV2Market memory market, address[] memory path) internal view returns (IUniswapV2Pair) {
        path.onlyValidPath();
        onlyIfHasPair(market, path);
        return IUniswapV2Pair(market.pairAddressOf(path));
    }

    function pairAddressOf(UniswapV2Market memory market, address[] memory path) internal view returns (address) {
        path.onlyValidPath();
        return market
            .factory()
            .getPair(path.token0(), path.token1());
    }
}