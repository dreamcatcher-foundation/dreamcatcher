// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct Asset {
    address factory;
    address router;
    address token0;
    address token1;
}