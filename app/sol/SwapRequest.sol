// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct SwapRequest {
    address factory;
    address router;
    address tokenIn;
    address tokenOut;
    uint256 amountIn;
    uint256 slippageThreshold;
}