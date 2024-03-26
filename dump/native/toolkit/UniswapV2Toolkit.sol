// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import './FixedPointValueToolkit.sol';
import '../../non-native/openzeppelin/token/ERC20/IERC20.sol';
import '../../non-native/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol';
import '../../non-native/uniswap/interfaces/IUniswapV2Factory.sol';
import '../../non-native/uniswap/interfaces/IUniswapV2Router02.sol';
import '../../non-native/uniswap/interfaces/IUniswapV2Pair.sol';

error UniswapV2Toolkit__InvalidPath(address[] path);
error UniswapV2Toolkit__PairDoesNotExist(address[] path);
error UniswapV2Toolkit__PairDoesNotMatch(address[] path, PairLayout layout);

enum PairLayout {
    HAS_MATCH,
    HAS_REVERSE_MATCH,
    HAS_NO_MATCH
}

function _yield(address[] memory path, address factory, address router, FixedPointValue memory amountIn) view returns (FixedPointValue memory asBasisPoints) {
    _onlyValidPath(path);
    FixedPointValue memory bestAmountOut = _bestAmountOut(path, factory, router, amountIn);
    FixedPointValue memory realAmountOut = _realAmountOut(path, router, amountIn);
    return _calculateYield(bestAmountOut, realAmountOut);
}

function _bestAmountOut(address[] memory path, address factory, address router, FixedPointValue memory amountIn) view returns (FixedPointValue memory asEther) {
    _onlyValidPath(path);
    amountIn = _asEther(amountIn);
    FixedPointValue memory quote = _quote(path, factory, router);
    FixedPointValue memory result = _mul(amountIn, quote, 18);
    return result;
}

function _realAmountOut(address[] memory path, address router, FixedPointValue memory amountIn) view returns (FixedPointValue memory asEther) {
    _onlyValidPath(path);
    amountIn = _asEther(amountIn);
    uint256 value = amountIn.value;
    uint256[] memory amounts = IUniswapV2Router02(router).getAmountsOut(value, path);
    uint256 amount = amounts[amounts.length - 1];
    FixedPointValue memory result = FixedPointValue({value: amount, decimals: _decimals1(path)});
    result = _asEther(result);
    return result;
}

function _quote(address[] memory path, address factory, address router) view returns (FixedPointValue memory asEther) {
    _onlyValidPath(path);
    if (!_hasPair(path, factory)) {
        revert UniswapV2Toolkit__PairDoesNotExist(path);
    }
    return _calculateQuote(path, factory, router, _layoutOf(path, factory));
}

function _calculateQuote(address[] memory path, address factory, address router, PairLayout layout) view returns (FixedPointValue memory asEther) {
    _onlyValidPath(path);
    if (layout == PairLayout.HAS_MATCH) {
        return _quoteLayout0(path, factory, router);
    }
    if (layout == PairLayout.HAS_REVERSE_MATCH) {
        return _quoteLayout1(path, factory, router);
    }
    revert UniswapV2Toolkit__PairDoesNotMatch(path, layout);
}

function _quoteLayout0(address[] memory path, address factory, address router) view returns (FixedPointValue memory asEther) {
    _onlyValidPath(path);
    uint256 result = IUniswapV2Router02(router)
        .quote(
            10**_decimals0(path),
            _reserveOf(path, factory)[0],
            _reserveOf(path, factory)[1]
        );
    FixedPointValue memory quote = FixedPointValue({value: result, decimals: _decimals1(path)});
    quote = _asEther(quote);
    return quote;
}

function _quoteLayout1(address[] memory path, address factory, address router) view returns (FixedPointValue memory asEther) {
    _onlyValidPath(path);
    uint256 result = IUniswapV2Router02(router)
        .quote(
            10**_decimals1(path),
            _reserveOf(path, factory)[1],
            _reserveOf(path, factory)[0]
        );
    FixedPointValue memory quote = FixedPointValue({value: result, decimals: _decimals1(path)});
    quote = _asEther(quote);
    return quote;
}

function _calculateYield(FixedPointValue memory bestAmountOut, FixedPointValue memory realAmountOut) pure returns (FixedPointValue memory asBasisPoints) {
    uint256 value0 = bestAmountOut.value;
    uint256 value1 = realAmountOut.value;
    if (value0 == 0) return _zero();
    if (value1 == 0) return _zero();
    if (value1 >= value0) return _full();
    FixedPointValue memory scale = _scale(realAmountOut, bestAmountOut, 18);
    return scale;
}

function _zero() pure returns (FixedPointValue memory asBasisPoints) {
    return FixedPointValue({value: 0, decimals: 18});
}

function _full() pure returns (FixedPointValue memory asBasisPoints) {
    return FixedPointValue({value: 10000_0000_0000_0000_0000_00, decimals: 18});
}

function _layoutOf(address[] memory path, address factory) view returns (PairLayout) {
    _onlyValidPath(path);
    IUniswapV2Pair pairInterface = _interfaceOf(path, factory);
    address token0 = pairInterface.token0();
    address token1 = pairInterface.token1();
    address tkn0 = _token0(path);
    address tkn1 = _token1(path);
    if (tkn0 == token0 && tkn1 == token1) return PairLayout.HAS_MATCH;
    if (tkn0 == token1 && tkn1 == token0) return PairLayout.HAS_REVERSE_MATCH;
    return PairLayout.HAS_NO_MATCH;
}

function _hasPair(address[] memory path, address factory) view returns (bool) {
    _onlyValidPath(path);
    return _addressOf(path, factory) != address(0);
}

function _reserveOf(address[] memory path, address factory) view returns (uint256[] memory) {
    _onlyValidPath(path);
    uint256[] memory reserve = new uint256[](2);
    (
        reserve[0],
        reserve[1],
    ) = _interfaceOf(path, factory).getReserves();
    return reserve;
}

function _interfaceOf(address[] memory path, address factory) view returns (IUniswapV2Pair) {
    _onlyValidPath(path);
    return IUniswapV2Pair(_addressOf(path, factory));
}

function _addressOf(address[] memory path, address factory) view returns (address) {
    _onlyValidPath(path);
    return IUniswapV2Factory(factory).getPair(_token0(path), _token1(path));
}

function _decimals0(address[] memory path) view returns (uint8) {
    _onlyValidPath(path);
    return IERC20Metadata(_token0(path)).decimals();
}

function _decimals1(address[] memory path) view returns (uint8) {
    _onlyValidPath(path);
    return IERC20Metadata(_token1(path)).decimals();
} 

function _token0(address[] memory path) pure returns (address) {
    _onlyValidPath(path);
    return path[0];
}

function _token1(address[] memory path) pure returns (address) {
    _onlyValidPath(path);
    return path[path.length - 1];
}

function _onlyValidPath(address[] memory path) pure returns (bool) {
    if (path.length < 2) {
        revert UniswapV2Toolkit__InvalidPath(path);
    }
    return true;
}