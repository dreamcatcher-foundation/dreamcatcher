// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Quote } from "./";


contract Market {
    struct Components {
        address feed;
    }

    address private _feed;

    constructor(Components memory components) {
        _feed = components.feed;
    }



    function highestQuote(address[] memory path, uint256 amountIn) public view returns (Quote memory);

    function averageQuote(address[] memory path, uint256 amountIn) public view returns (Quote memory);

    function lowestSlippage(address[] memory path, uint256 amountIn) public view returns (Quote memory) {
        Quote memory quote;
        uint256 lowest;
        for (uint256 i = 0; i < _adaptors.length; i += 1) {
            address adaptor = _adaptors[i];
            Quote memory x = IUniswapV2Adaptor(adaptor).quote(path, amountIn);
            if (x.result.ok) {
                if (x.slippage < lowest) {
                    quote = x;
                }
            }
        }
        return quote;
    }
}