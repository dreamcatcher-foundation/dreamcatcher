// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IToken } from "./IToken.sol";
import { FixedPointMath } from "./FixedPointMath.sol";

contract ThirdPartyBroker is FixedPointCalculator {
    using FixedPointMath for uint256;

    modifier thirdPartySwap(address router, address tokenIn, uint256 amountIn) {
        address broker = address(this);
        IToken tokenInIntf = IToken(tokenIn);
        uint8 decimals = tokenInIntf.decimals();
        uint256 callerBalanceN = tokenInIntf.balanceOf(msg.sender);
        uint256 callerBalance = _cast(callerBalanceN, decimals, 18);
        require(callerBalance >= amountIn, "ThirdPartyBroker: callerBalance < amountIn");
        uint256 callerAllowanceN = tokenInIntf.allowance(msg.sender, broker);
        uint256 callerAllowance = _cast(callerAllowanceN, decimals, 18);
        require(callerAllowance >= amountIn, "ThirdPartyBroker: callerAllowance < amountIn");
        uint256 amountInN = _cast(amountIn, 18, decimals);
        tokenInIntf.transferFrom(msg.sender, broker, amountInN);
        tokenInIntf.approve(router, 0);
        tokenInIntf.approve(router, amountInN);
        _;
        tokenInIntf.approve(router, 0);
    }

    modifier authorizeThirdPartySwap(address broker, address tokenIn, uint256 amountIn) {
        address sender = address(this);
        IToken tokenInIntf = IToken(tokenIn);
        uint8 decimals = tokenInIntf.decimals();
        uint256 balanceN = tokenInIntf.balanceOf(sender);
        uint256 balance = _cast(balanceN, decimals, 18);
        require(balance >= amountIn, "ThirdPartyBroker: balance < amountIn");
        uint256 amountInN = _cast(amountIn, 18, decimals);
        tokenInIntf.approve(broker, 0);
        tokenInIntf.approve(broker, amountInN);
        _;
        tokenInIntf.approve(broker, 0);
    }
}