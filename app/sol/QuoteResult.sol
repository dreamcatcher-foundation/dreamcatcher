// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct QuoteResult {
    uint256 amountIn;
    uint256 quote;
    uint256 out;
    uint256 slippage;
}