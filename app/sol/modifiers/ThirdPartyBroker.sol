// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { FixedPointEngine } from "../engines/FixedPointEngine.sol";

contract ThirdPartyBroker is FixedPointEngine {
    bool private _locked;
    
    modifier thirdPartySwap(address tokenIn, uint256 amountIn, address to) {
        _beforeSwapHook(tokenIn, amountIn, to);
        _;
        _afterSwapHook(tokenIn, amountIn, to);
    }

    function _beforeSwapHook(address tokenIn, uint256 amountIn, address to) private returns (bool) {
        require(!_locked, "REENTRANT_CALL");
        _locked = true;
        uint8 decimals = IERC20Metadata(tokenIn).decimals();
        uint256 callerBalanceN = IERC20(tokenIn).balanceOf(msg.sender);
        uint256 callerBalance = _cast(callerBalanceN, decimals, 18);
        require(amountIn <= callerBalance, "INSUFFICIENT_CALLER_BALANCE");
        uint256 amountInN = _cast(amountIn, 18, decimals);
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountInN);
        IERC20(tokenIn).approve(to, 0);
        IERC20(tokenIn).approve(to, amountInN);
        return true;
    }

    function _afterSwapHook(address tokenIn, uint256 amountIn, address to) private returns (bool) {
        IERC20(tokenIn).approve(to, 0);
        _locked = false;
        return true;
    }
}