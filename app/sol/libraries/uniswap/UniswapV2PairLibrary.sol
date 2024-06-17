// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IERC20 } from "../../imports/openzeppelin/token/ERC20/IERC20.sol";
import { IUniswapV2Pair } from "../../imports/uniswap/interfaces/IUniswapV2Pair.sol";
import { UniswapV2Pair } from "./UniswapV2Pair.sol";
import { UniswapV2PathLibrary } from "./UniswapV2PathLibrary.sol";
import { UniswapV2PairLayout } from "./UniswapV2PairLayout.sol";
import { FixedPointValue } from "../fixedPoint/FixedPointValue.sol";
import { FixedPointLibrary } from "../fixedPoint/FixedPointLibrary.sol";

library UniswapV2PairLibrary {
    using UniswapV2PathLibrary for address[];

    error UnrecognizedV2PairLayout();

    function optimalAssetValue(UniswapV2Pair memory pair, address account) internal view returns (FixedPointValue memory asEther) {
        return optimalAmountOut(_balance(pair, account));
    }

    function actualAssetValue(UniswapV2Pair memory pair, address account) internal view returns (FixedPointValue memory asEther) {
        return actualAmountOut(_balance(pair, account));
    }

    function yield(UniswapV2Pair memory pair, FixedPointValue memory amountIn) internal view returns (FixedPointValue memory percentageAsEther) {
        FixedPointValue memory optimal = bestAmountOut(amountIn);
        FixedPointValue memory actual = realAmountOut(amountIn);
        return FixedPointLibrary.yield(actual, optimal);
    }

    function optimalAmountOut(UniswapV2Pair memory pair, FixedPointValue memory amountIn) internal view returns (FixedPointValue memory asEther) {
        return FixedPointLibrary.mul(FixedPointLibrary.convertToEtherDecimals(amountIn), quote(pair));
    }

    function actualAmountOut(UniswapV2Pair memory pair, FixedPointValue memory amountIn) internal view returns (FixedPointValue memory asEther) {
        uint256[] memory amounts = pair.router.getAmountsOut(FixedPointLibrary.convertToEtherDecimals(amountIn).value, pair.path);
        uint256 amount = amounts[amounts.length - 1];
        return FixedPointLibrary.convertToEtherDecimals(FixedPointValue({ value: amount, decimals: pair.path.lastTokenDecimals() }));
    }

    function quote(UniswapV2Pair memory pair) internal view returns (FixedPointValue memory asEther) {
        if (_layout(pair) == UniswapV2PairLayout.IsMatch) {
            return _quote0(pair);
        }
        if (_layout(pair) == UniswapV2PairLayout.IsReverseMatch) {
            return _quote1(pair);
        }
        revert UnrecognizedV2PairLayout();
    }

    function _balance(UniswapV2Pair memory pair, address account) private view returns (FixedPointValue memory asEther) {
        return FixedPointLibrary.balanceOfAsEther(IERC20(pair.path.firstToken()), account);
    }

    function _quote0(UniswapV2Pair memory pair) private view returns (FixedPointLibrary memory asEther) {
        uint256 result = pair.router.quote(
            10**pair.path.firstTokenDecimals(),
            _reserves(pair)[0],
            _reserves(pair)[1]
        );
        return FixedPointLibrary.convertToEtherDecimals(FixedPointValue({ value: result, decimals: pair.path.firstTokenDecimals() }));
    }

    function _quote1(UniswapV2Pair memory pair) private view returns (FixedPointLibrary memory asEther) {
        uint256 result = pair.route.quote(
            10**pair.path.lastTokenDecimals(),
            _reserves(pair)[1],
            _reserves(pair)[0]
        );
        return FixedPointLibrary.convertToEtherDecimals(FixedPointValue({ value: result, decimals: pair.path.lastTokenDecimals() }));
    }

    function _reserves(UniswapV2Pair memory pair) private view returns (uint256[] memory) {
        uint256[] memory reserves = new uint256[](2);
        (
            reserves[0],
            reserves[1],
        ) = _interface(pair).getReserves();
        return reserves;
    }

    function _layout(UniswapV2Pair memory pair) private view returns (UniswapV2PairLayout) {
        if (
            pair.path.firstToken() == _interface(pair).token0() &&
            pair.path.lastToken() == _interface(pair).token1()
        ) {
            return UniswapV2PairLayout.IsMatch;
        }
        if (
            pair.path.firstToken() == _interface(pair).token1() &&
            pair.path.lastToken() == _interface(pair).token0()
        ) {
            return UniswapV2PairLayout.IsReverseMatch;
        }
        return UniswapV2PairLayout.IsNotMatch;
    }

    function _interface(UniswapV2Pair memory pair) private view returns (IUniswapV2Pair) {
        return pair.factory.getPair(pair.path.firstToken(), pair.path.lastToken());
    }
}