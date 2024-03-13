// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../adaptor/TokenAddressAdaptorLib.sol";
import "../adaptor/UniswapV2PairAdaptorLib.sol";
import "./PaymentActionLib.sol";
import "./TradeActionLib.sol";

library RedeemActionLib {
    using UniswapV2PairAdaptorLib for UniswapV2PairAdaptorLib.PathPayload;
    using TradeActionLib for TradeActionLib.TradePayload;
    using PaymentActionLib for address;
    using TokenAddressAdaptorLib for address;
    using RedeemActionLib for RedeemPayload;

    struct RedeemPayload {
        address token;
        address asset;
        address uniswapV2Factory;
        address uniswapV2Router;
        uint256 ownershipAsBasisPoint;
        uint256 maximumSlippageAsBasisPoint;
    }

    function redeem(RedeemPayload memory redeem) internal returns (bool) {
        uint256 amountOutR64 = (redeem.token.balanceR64() / 10000) * redeem.ownershipAsBasisPoint;
        address[] memory path = new address[](2);
        path[0] = redeem.token;
        path[1] = redeem.asset;
        UniswapV2PairAdaptorLib.PathPayload memory pathPayload;
        pathPayload.path = path;
        pathPayload.uniswapV2Factory = redeem.uniswapV2Factory;
        pathPayload.uniswapV2Router = redeem.uniswapV2Router;
        pathPayload.amountInR64 = amountOutR64;
        uint256 slippage = UniswapV2PairAdaptorLib.slippage(pathPayload);
        if (slippage <= redeem.maximumSlippageAsBasisPoint) {
            TradeActionLib.TradePayload memory trade;
            trade.token = redeem.token;
            trade.asset = redeem.asset;
            trade.uniswapV2Factory = redeem.uniswapV2Factory;
            trade.uniswapV2Router = redeem.uniswapV2Router;
            trade.amountInR64 = amountOutR64;
            uint256 assetsOutR64 = TradeActionLib.sell(trade);
            redeem.asset.deliverToken(assetsOutR64);
            return true;
        }
        redeem.token.deliverToken(amountOutR64);
        return true;
    }

    function batchRedeem(RedeemPayload[] memory redeem) internal returns (bool) {
        for (uint256 i = 0; i < redeem.length; i++) {
            redeem[i].redeem();
        }
        return true;
    }
}