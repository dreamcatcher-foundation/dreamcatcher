// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { UniswapV2PathClass } from "./UniswapV2PathClass.sol";
import { FixedPointValueClass } from "./FixedPointValueClass.sol";

library UniswapV2PairClass {
    using UniswapV2PairClass for UniswapV2Pair;
    using UniswapV2PathClass for UniswapV2PathClass.UniswapV2Path;
    using FixedPointValueClass for FixedPointValueClass.FixedPointValue;

    error InvalidUniswapV2Pair();
    error InvalidUniswapV2PairLayout();
    error InsufficientYield();

    enum UniswapV2PairLayout {
        IsMatch,
        IsReverseMatch,
        IsNotMatch
    }

    struct UniswapV2Pair {
        UniswapV2PathClass.UniswapV2Path path;
        address router;
        address factory;
    }

    function bestTotalAssets(UniswapV2Pair storage self) internal view returns (FixedPointMathLibrary.FixedPointValue memory r18) {
        return self.bestAmountOut(self.balance());
    }

    function realTotalAssets(UniswapV2Pair storage self) internal view returns (FixedPointMathLibrary.FixedPointValue memory r18) {
        return self.realAmountOut(self.balance());
    }

    function balance(UniswapV2Pair storage self) internal view returns (FixedPointMathLibrary.FixedPointValue memory r18) {
        return FixedPointMathLibrary.FixedPointValue({ value: IERC20(self.path.firstToken()).balanceOf(address(this)), decimals: self.firstTokenDecimals() }).toEther();
    }

    function yield(UniswapV2Pair storage self, FixedPointMathLibrary.FixedPointValue memory amountIn) internal view returns (FixedPointMathLibrary.FixedPointValue memory bpR18) {
        FixedPointMathLibrary.FixedPointValue memory best = self.bestAmountOut(amountIn);
        FixedPointMathLibrary.FixedPointValue memory real = self.realAmountOut(amountIn);
        return best.yield(real);
    }

    function bestAmountOut(UniswapV2Pair storage self, FixedPointMathLibrary.FixedPointValue memory amountIn) internal view returns (FixedPointMathLibrary.FixedPointValue memory r18) {
        return amountIn.toEther().mul(self.quote());
    }

    function realAmountOut(UniswapV2Pair storage self, FixedPointMathLibrary.FixedPointValue memory amountIn) internal view returns (FixedPointMathLibrary.FixedPointValue memory r18) {
        uint256[] memory amounts = IUniswapV2Router02(self.router).getAmountsOut(amountIn.toEther().value, self.path.path);
        uint256 amount = amounts[amounts.length - 1];
        return FixedPointValueClass.FixedPointValue({ value: amount, decimals: pair.path.lastTokenDecimals() }).toEther();
    }

    function quote(UniswapV2Pair storage self) internal view returns (FixedPointMathLibrary.FixedPointValue memory r18) {
        if (_layout(self) == UniswapV2PairLayout.IsMatch) {
            return _quote0(self);
        }
        if (_layout(self) == UniswapV2PairLayout.IsReverseMatch) {
            return _quote1(self);
        }
        revert InvalidUniswapV2PairLayout();
    }

    function reserves(UniswapV2Pair storage self) internal view returns (uint256[] memory) {
        uint256[] memory reserves = new uint256[](2);
        (
            reserves[0], 
            reserves[1],
        ) 
            = self.getInterface().getReserves();
        return reserves;
    }

    function getInterface(UniswapV2Pair storage self) internal view returns (IUniswapV2Pair) {
        return IUniswapV2Pair(self.getAddress());
    }

    function getAddress(UniswapV2Pair storage self) internal view returns (address) {
        return IUniswapV2Factory(self.factory).getPair(self.path.firstToken(), self.path.lastToken());
    }

    function _quote0(UniswapV2Pair storage self) private view returns (FixedPointValueClass.FixedPointValue memory r18) {
        uint256 result = IUniswapV2Router02(self.router).quote(
            10**self.path.firstTokenDecimals(),
            self.reserves()[0],
            self.reserves()[1]
        );
        return FixedPointValueClass.FixedPointValue({ value: result, decimals: self.path.firstTokenDecimals() }).toEther();
    }

    function _quote1(UniswapV2Pair storage self) private view returns (FixedPointValueClass.FixedPointValue memory r18) {
        uint256 result = IUniswapV2Router02(self.router).quote(
            10**self.path.lastTokenDecimals(),
            self.reserves()[1],
            self.reserves()[0]
        );
        return FixedPointValueClass.FixedPointValue({ value: result, decimals: self.path.lastTokenDecimals() }).toEther();
    }

    function _layout(UniswapV2Pair storage self) private view returns (UniswapV2PairLayout) {
        if (
            self.path.firstToken() == self.getInterface().token0() &&
            self.path.lastToken() == self.getInterface().token1()
        ) {
            return UniswapV2PairLayout.IsMatch;
        }
        if (
            self.path.firstToken() == self.getInterface().token1() &&
            self.path.lastToken() == self.getInterface().token0()
        ) {
            return UniswapV2PairLayout.IsNotMatch;
        }
        return UniswapV2PairLayout.IsNotMatch;
    }
}