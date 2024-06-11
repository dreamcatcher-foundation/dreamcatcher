// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IUniswapV2Router02 } from "../import/uniswap/interfaces/IUniswapV2Router02.sol";
import { IUniswapV2Factory } from "../import/uniswap/interfaces/IUniswapV2Factory.sol";
import { UniswapV2Market } from "../struct/UniswapV2Market.sol";

library UniswapV2MarketLib {
    function router(UniswapV2Market memory uniswapV2Market) internal view returns (address) {
        return uniswapV2Market.inner.router;
    }

    function factory(UniswapV2Market memory uniswapV2Market) internal view returns (address) {
        return uniswapV2Market.inner.factory;
    }

    function toRouter(UniswapV2Market memory uniswapV2Market) internal view returns (IUniswapV2Router02 memory) {
        return IUniswapV2Router02(router(uniswapV2Market));
    }

    function toFactory(UniswapV2Market memory uniswapV2Market) internal view returns (IUniswapV2Factory memory) {
        return IUniswapV2Factory(factory(uniswapV2Market));
    }
}