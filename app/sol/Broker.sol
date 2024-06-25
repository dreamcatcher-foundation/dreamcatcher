// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IFeed } from "./Feed.sol";

struct Components {
    address feed;
}

contract Broker {
    event Swap(address to, address factory, address router, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);

    address private _feed;

    constructor(Components memory components) {
        _feed = components.feed;
    }
    


    function _quote(address factory, address router, address[] memory path, uint256 amountIn) private view returns (uint256 optimal, uint256 adjusted, uint256 slippage) {
        return IFeed(_feed).quote(factory, router, path, amountIn);
    }
}