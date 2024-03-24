// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import { IERC20 } from "../../non-native/openzeppelin/token/ERC20/IERC20.sol";
import { IERC20Metadata } from "../../non-native/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { IUniswapV2Pair } from "../../non-native/uniswap/interfaces/IUniswapV2Pair.sol";
import { FixedPointValue } from "../shared/FixedPointValue.sol";
import { FixedPointToolkit } from "../math/FixedPointToolkit.sol";
import { V2OracleStoragePointer } from "../storage-pointers/V2OracleStoragePointer.sol";

contract UniswapV2Adaptor is
         V2OracleStoragePointer,
         FixedPointToolkit {

    error UniswapV2Adaptor__PairDoesNotExist(address[] path);
    error UniswapV2Adaptor__PairDoesNotMatchPath(address[] path, PairLayout layout);
    error UniswapV2Adaptor__PathIsLengthIsLessThan2(address[] path);
    error UniswapV2Adaptor__InsufficientYield(address[] path, FixedPointValue amountIn, FixedPointValue minYield);

    enum PairLayout {
        HAS_MATCH,
        HAS_REVERSE_MATCH,
        HAS_NO_MATCH
    }

    modifier onlyIfPathLengthIsAtLeast2(address[] memory path) {
        _onlyIfPathLengthIsAtLeast2(path);
        _;
    }

    function _swap(address[] memory path, FixedPointValue memory amountIn, FixedPointValue memory minYield) internal only2SimilarFixedPointTypes(amountIn, minYield) returns (FixedPointValue memory) {
        if (_yield(path, amountIn).value < minYield.value) revert UniswapV2Adaptor__InsufficientYield(path, amountIn, minYield);
        IERC20(_token0(path)).approve(address(_router()), 0);
        IERC20(_token0(path)).approve(address(_router()), _asNewDecimals(amountIn, _decimals0(path)).value);
        uint256[] memory amounts = _router().swapExactTokensForTokens(_amountInAsDecimals0(path, amountIn).value, _amountOutAsDecimals1(path, amountIn).value, path, msg.sender, block.timestamp);
        uint256 amount = amounts[amounts.length - 1];
        return _asEther(FixedPointValue({value: amount, decimals: _decimals1(path)}));
    }

    function _amountInAsDecimals0(address[] memory path, FixedPointValue memory amountIn) private view returns (FixedPointValue memory) {
        return _asNewDecimals(amountIn, _decimals0(path));
    }

    function _amountOutAsDecimals1(address[] memory path, FixedPointValue memory amountIn) private view returns (FixedPointValue memory) {
        return _asNewDecimals(_realAmountOut(path, amountIn), _decimals1(path));
    }

    function _yield(address[] memory path, FixedPointValue memory amountIn) internal view onlyIfPathLengthIsAtLeast2(path) returns (FixedPointValue memory asBasisPoints) {
        return _calculateYield(_bestAmountOut(path, amountIn), _realAmountOut(path, amountIn));
    }

    function _bestAmountOut(address[] memory path, FixedPointValue memory amountIn) internal view onlyIfPathLengthIsAtLeast2(path) returns (FixedPointValue memory asEther) {
        return _asEther(_mul(_asEther(amountIn), _quote(path)));
    }

    function _realAmountOut(address[] memory path, FixedPointValue memory amountIn) internal view onlyIfPathLengthIsAtLeast2(path) returns (FixedPointValue memory asEther) {
        uint256[] memory amounts = _router().getAmountsOut(_asEther(amountIn).value, path);
        uint256 amount = amounts[amounts.length - 1];
        return _asEther(FixedPointValue({value: amount, decimals: _decimals1(path)}));
    }

    function _quote(address[] memory path) internal view onlyIfPathLengthIsAtLeast2(path) returns (FixedPointValue memory asEther) {
        if (!_hasPair(path)) {
            revert UniswapV2Adaptor__PairDoesNotExist(path);
        }
        return _calculateQuote(path, _layoutOf(path));
    }

    function _calculateQuote(address[] memory path, PairLayout layout) private view onlyIfPathLengthIsAtLeast2(path) returns (FixedPointValue memory asEther) {
        if (layout == PairLayout.HAS_MATCH) {
            return _quoteLayout0(path);
        }
        if (layout == PairLayout.HAS_REVERSE_MATCH) {
            return _quoteLayout1(path);
        }
        revert UniswapV2Adaptor__PairDoesNotMatchPath(path, layout);
    }

    function _quoteLayout0(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (FixedPointValue memory asEther) {
        uint256 result = _router()
            .quote(
                10**_decimals0(path),
                _reserveOf(path)[0],
                _reserveOf(path)[1]
            );
        return _asEther(FixedPointValue({value: result, decimals: _decimals1(path)}));  
    }

    function _quoteLayout1(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (FixedPointValue memory asEther) {
        uint256 result = _router()
            .quote(
                10**_decimals1(path),
                _reserveOf(path)[1],
                _reserveOf(path)[0]
            );
        return _asEther(FixedPointValue({value: result, decimals: _decimals1(path)}));
    }

    function _calculateYield(FixedPointValue memory bestAmountOut, FixedPointValue memory realAmountOut) private pure only2SimilarFixedPointTypes(bestAmountOut, realAmountOut) returns (FixedPointValue memory asBasisPoints) {
        if (bestAmountOut.value == 0) {
            return _zeroYield();
        }
        if (realAmountOut.value == 0) {
            return _zeroYield();
        }
        if (realAmountOut.value >= bestAmountOut.value) {
            return _fullYield();
        }
        return _asEther(_scale(realAmountOut, bestAmountOut));
    }

    function _zeroYield() private pure returns (FixedPointValue memory asBasisPoints) {
        return FixedPointValue({value: 0, decimals: 18});
    }

    function _fullYield() private pure returns (FixedPointValue memory asBasisPoints) {
        return _asEther(FixedPointValue({value: 10_000, decimals: 0}));
    }

    function _layoutOf(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (PairLayout) {
        IUniswapV2Pair pairInterface = _interfaceOf(path);
        address token0 = pairInterface.token0();
        address token1 = pairInterface.token1();
        if (_token0(path) == token0 && _token1(path) == token1) return PairLayout.HAS_MATCH;
        if (_token0(path) == token1 && _token1(path) == token0) return PairLayout.HAS_REVERSE_MATCH;
        return PairLayout.HAS_NO_MATCH;
    }

    function _hasPair(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (bool) {
        return _addressOf(path) != address(0);
    }

    function _reserveOf(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (uint256[] memory) {
        uint256[] memory reserve = new uint256[](2);
        (reserve[0], reserve[1],) = _interfaceOf(path).getReserves();
        return reserve;
    }

    function _interfaceOf(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (IUniswapV2Pair) {
        return IUniswapV2Pair(_addressOf(path));
    }

    function _addressOf(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (address) {
        return _factory().getPair(_token0(path), _token1(path));
    }

    function _decimals0(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (uint8) {
        return IERC20Metadata(_token0(path)).decimals();
    }

    function _decimals1(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (uint8) {
        return IERC20Metadata(_token1(path)).decimals();
    }

    function _token0(address[] memory path) private pure onlyIfPathLengthIsAtLeast2(path) returns (address) {
        return path[0];
    }

    function _token1(address[] memory path) private pure onlyIfPathLengthIsAtLeast2(path) returns (address) {
        return path[path.length - 1];
    }

    function _onlyIfPathLengthIsAtLeast2(address[] memory path) private pure {
        if (path.length < 2) {
            revert UniswapV2Adaptor__PathIsLengthIsLessThan2(path);
        }
    }
}