// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct Pair {
    address addr;
    address factory;
    address router;
    address token0;
    address token1;
    uint8 decimals0;
    uint8 decimals1;
    uint112 reserve0;
    uint112 reserve1;
}