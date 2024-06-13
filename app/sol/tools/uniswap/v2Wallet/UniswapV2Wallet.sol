// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { UniswapV2Pair } from "../v2Pair/UniswapV2Pair.sol";

struct UniswapV2Wallet {
    UniswapV2Pair[] pairs;
    address asset;
    bool initialized;
}