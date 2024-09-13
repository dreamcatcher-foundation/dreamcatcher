// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IToken} from "../asset/token/IToken.sol";
import {IUniswapV2Router02} from "../import/uniswap/v2/interfaces/IUniswapV2Router02.sol";
import {IUniswapV2Factory} from "../import/uniswap/v2/interfaces/IUniswapV2Factory.sol";
import {StringEngine} from "./StringEngine.sol";

abstract contract X64ExchangeSlots is StringEngine {

    struct Exchange {
        IUniswapV2Router02 routerI;
        IUniswapV2Factory factoryI;

        string name;
    }

    Exchange[64] private _slots;

    function _exchangesCount() internal view returns (uint8) {
        uint8 count;

        for (uint8 i; i < _slots.length;) {
            Exchange storage exchange = _slots[i];
            string memory name0 = exchange.name;
            string memory name1;

            if (!_isMatch(name0, name1)) count++;
            
            unchecked {
                i++;
            }
        }

        return count;
    }

    function _exchanges(string memory name) internal view returns (Exchange storage) {
        if (_isEmpty(name)) revert ("NAME_NOT_GIVEN");
        
        for (uint8 i; i < _slots.length;) {
            Exchange storage exchange = _slots[i];
            string memory name0 = exchange.name;
            string memory name1 = name;

            if (_isMatch(name0, name1)) return exchange;

            unchecked {
                i++;
            }
        }

        revert ("EXCHANGE_NOT_FOUND");
    }
}