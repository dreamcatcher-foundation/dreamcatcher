// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IERC20Metadata } from "../../../import/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { IUniswapV2Pair } from "../../../import/uniswap/interfaces/IUniswapV2Pair.sol";
import { IUniswapV2Router02 } from "../../../import/uniswap/interfaces/IUniswapV2Router02.sol";
import { IUniswapV2Factory } from "../../../import/uniswap/interfaces/IUniswapV2Factory.sol";
import { UniswapV2Pair } from "./UniswapV2Pair.sol";
import { PairLayout } from "./PairLayout.sol";
import { FixedPointValue } from "../../math/fixedPoint/FixedPointValue.sol";
import { FixedPointValueConversionLib } from "../../math/fixedPoint/FixedPointValueConversionLib.sol";
import { FixedPointValueArithmeticLib } from "../../math/fixedPoint/FixedPointValueArithmeticLib.sol";
import { FixedPointValueYieldLib } from "../../math/fixedPoint/FixedPointValueYieldLib.sol";

library UniswapV2PairStLib {
    error InvalidUniswapV2Path();
    error InvalidUniswapV2Pair();
    error InvalidUniswapV2PairLayout();

    function yield(UniswapV2Pair storage pair, FixedPointValue memory amountIn) internal view returns (FixedPointValue memory asBasisPointsInEther) {
        return FixedPointValueYieldLib.calculateYield(bestAmountOut(pair, amountIn), realAmountOut(pair, amountIn));
    }

    function bestAmountOut(UniswapV2Pair storage pair, FixedPointValue memory amountIn) internal view returns (FixedPointValue memory asEther) {
        _checkPath(pair);
        _checkPair(pair);
        return FixedPointValueArithmeticLib.mul(FixedPointValueConversionLib.toEther(amountIn), quote(pair));
    }

    function realAmountOut(UniswapV2Pair storage pair, FixedPointValue memory amountIn) internal view returns (FixedPointValue memory asEther) {
        _checkPath(pair);
        _checkPair(pair);
        uint256[] memory amounts
            = IUniswapV2Router02(pair.router)
                .getAmountsOut(FixedPointValueConversionLib.toEther(amountIn).value, pair.path);
        uint256 amount = amounts[amounts.length - 1];
        return FixedPointValueConversionLib.toEther(FixedPointValue({ value: amount, decimals: _decimals1(pair) }));
    }

    function quote(UniswapV2Pair storage pair) internal view returns (FixedPointValue memory asEther) {
        _checkPath(pair);
        _checkPair(pair);
        return _quote(pair, _layout(pair));
    }

    function _checkPath(UniswapV2Pair storage pair) private pure {
        if (pair.path.length < 2) {
            revert InvalidUniswapV2Path();
        }
    }

    function _checkPair(UniswapV2Pair storage pair) private view {
        if (_address(pair) == address(0)) {
            revert InvalidUniswapV2Pair();
        }
    }

    function _quote(UniswapV2Pair storage pair, PairLayout layout) private view returns (FixedPointValue memory asEther) {
        if (layout == PairLayout.IsMatch) {
            return _quote0(pair);
        }   
        if (layout == PairLayout.IsReverseMatch) {
            return _quote1(pair);
        }
        revert InvalidUniswapV2PairLayout();
    }

    function _quote0(UniswapV2Pair storage pair) private view returns (FixedPointValue memory asEther) {
        uint256 result
            = IUniswapV2Router02(pair.router)
                .quote(
                    10**_decimals0(pair),
                    _reserves(pair)[0],
                    _reserves(pair)[1]
                );
        return FixedPointValueConversionLib.toEther(FixedPointValue({ value: result, decimals: _decimals1(pair) }));
    }

    function _quote1(UniswapV2Pair storage pair) private view returns (FixedPointValue memory asEther) {
        uint256 result
            = IUniswapV2Router02(pair.router)
                .quote(
                    10**_decimals1(pair),
                    _reserves(pair)[1],
                    _reserves(pair)[0]
                );
        return FixedPointValueConversionLib.toEther(FixedPointValue({ value: result, decimals: _decimals1(pair) }));
    }

    function _layout(UniswapV2Pair storage pair) private view returns (PairLayout) {
        if (
            _token0(pair) == _interface(pair).token0() &&
            _token1(pair) == _interface(pair).token1()
        ) {
            return PairLayout.IsMatch;
        }
        if (
            _token0(pair) == _interface(pair).token1() &&
            _token1(pair) == _interface(pair).token0()
        ) {
            return PairLayout.IsReverseMatch;
        }
        return PairLayout.IsNotMatch;
    }

    function _reserves(UniswapV2Pair storage pair) private view returns (uint256[] memory) {
        uint256[] memory reserves = new uint256[](2);
        (reserves[0], reserves[1],)
            = _interface(pair).getReserves();
        return reserves;
    }

    function _interface(UniswapV2Pair storage pair) private view returns (IUniswapV2Pair) {
        return IUniswapV2Pair(_address(pair));
    }

    function _address(UniswapV2Pair storage pair) private view returns (address) {
        return IUniswapV2Factory(pair.factory).getPair(_token0(pair), _token1(pair));
    }

    function _decimals0(UniswapV2Pair storage pair) private view returns (uint8) {
        return IERC20Metadata(_token0(pair)).decimals();
    }

    function _decimals1(UniswapV2Pair storage pair) private view returns (uint8) {
        return IERC20Metadata(_token1(pair)).decimals();
    }

    function _token0(UniswapV2Pair storage pair) private pure returns (address) {
        return pair.path[0];
    }

    function _token1(UniswapV2Pair storage pair) private pure returns (address) {
        return pair.path[pair.path.length - 1];
    }
}