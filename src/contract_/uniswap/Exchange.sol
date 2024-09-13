// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IToken} from "./asset/token/IToken.sol";
import {IUniswapV2Router02} from "./import/uniswap/v2/interfaces/IUniswapV2Router02.sol";
import {IUniswapV2Factory} from "./import/uniswap/v2/interfaces/IUniswapV2Factory.sol";
import {IUniswapV2Pair} from "./import/uniswap/v2/interfaces/IUniswapV2Pair.sol";

struct Exchange {
    string name;
    IUniswapV2Router02 routerI;
    IUniswapV2Factory factoryI;
}

function ExchangeImpl(string memory name, IUniswapV2Router02 routerI, IUniswapV2Factory factoryI) pure returns (Exchange memory) {
    return Exchange({
        name: name,
        routerI: routerI,
        factoryI: factoryI
    });
}

library ExchangeLibrary {
    using ExchangeLibrary for Exchange;

    function _reserve(Exchange memory exchange, IToken tokenI0, IToken tokenI1) private view returns (uint256, uint256) {

    }

    function _checkReserve(Exchange memory exchange, IToken tokenI0, IToken tokenI1) private view {
        
    }
}