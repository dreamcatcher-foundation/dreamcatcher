// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct UniswapV2Market {
    Inner inner;
}

struct Inner {
    address factory;
    address router;
}