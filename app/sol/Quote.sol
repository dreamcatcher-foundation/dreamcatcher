// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Result } from "./Result.sol";
import { Pair } from "./Pair.sol";

struct Quote {
    Result result;
    Pair pair;
    uint256 amountIn;
    uint256 bestAmountOut;
    uint256 realAmountOut;
    uint256 slippage;
}