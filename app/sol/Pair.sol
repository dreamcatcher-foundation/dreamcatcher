// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Result } from "./Result.sol";

struct Pair {
    Result result;
    address addr;
    address token0;
    address token1;
    uint8 decimals0;
    uint8 decimals1;
    uint112 reserve0;
    uint112 reserve1;
}