// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import
import { UniswapV2Market } from "../../../struct/UniswapV2Market.sol";

struct Vault {
    Inner inner;
}

struct Inner {
    EnumerableSet.AddressSet trackedTokens;
    UniswapV2Market uniswapV2Market;
    uint8 maxTrackedTokens;
}