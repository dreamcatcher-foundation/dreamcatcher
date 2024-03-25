// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import './UniswapV2Toolkit.sol';
import './FixedPointValueToolkit.sol';

error UniswapV2SwapToolkit__InsufficientYield(address[] path, FixedPointValue amountIn, FixedPointValue minYield);

function _swap(address[] memory path, address factory, address router, FixedPointValue memory amountIn, FixedPointValue memory minYield) returns (FixedPointValue memory) {
    FixedPointValue memory yield = _yield(path, factory, router, amountIn);
    bool insufficientYield = _isLessThan(yield, minYield);
    if (insufficientYield) {
        revert UniswapV2SwapToolkit__InsufficientYield(path, amountIn, minYield);
    }
    IERC20 tokenIn = IERC20(_token0(path));
    tokenIn.approve(router, 0);
    tokenIn.approve(router, _asNewDecimals(amountIn, _decimals0(path)))
}

function _usingUniswapV2SwapToolkitApprove(address[] memory path, address router, FixedPointValue amountIn) returns (bool) {
    address tokenIn = _token0(path);
    uint8 decimalsIn = _decimals0(path);
    IERC20 tokenInERC20 = IERC20(tokenIn);
    amountIn = _asNewDecimals(amountIn, decimalsIn);
    uint256 valueIn = amountIn.value;
    tokenInERC20.approve(router, 0);
    tokenInERC20.approve(router, valueIn);
}

function _amountAsDecimals0(address[] memory path, FixedPointValue memory amountIn) view returns (FixedPointValue memory) {
    uint8 decimals0 = _decimals0(path);
    return _asNewDecimals(amountIn, decimals1);
}

function _amountAsDecimals1(address[] memory path, FixedPointValue memory amountIn) view returns (FixedPointValue memory) {
    uint8 decimals0 = _decimals1(path);
    return _asNewDecimals(amountIn, decimals0);
}