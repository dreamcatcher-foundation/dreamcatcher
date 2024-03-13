// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../../non-native/openzeppelin/utils/structs/EnumerableSet.sol";
import "../util/action/TradeActionLib.sol";
import "../util/adaptor/TokenAddressAdaptorLib.sol";

library MarketStorageLib {
    using EnumerableSet for EnumerableSet.AddressSet;
    using TradeActionLib for TradeActionLib.TradeWithSlippagePayload;
    using MarketStorageLib for Market;
    using TokenAddressAdaptorLib for address;

    event TokenEnabled(address token);
    event TokenDisabled(address token);
    event ChangedMarketAsset(address asset);
    event ChangedMarketUniswapV2Factory(address uniswapV2Factory);
    event ChangedMarketUniswapV2Router(address uniswapV2Router);
    event ChangedMarketMaximumSlippage(uint256 maximumSlippageAsBasisPoint);

    struct Market {
        Hidden hidden;
    }

    struct Hidden {
        EnumerableSet.AddressSet enabledTokens;
        address asset;
        address uniswapV2Factory;
        address uniswapV2Router;
        uint256 maximumSlippageAsBasisPoint;
    }

    function enabledTokens(Market storage market) internal view returns (address[] memory) {
        return market.hidden.enabledTokens.values();
    }

    function enabledTokens(Market storage market, uint256 tokenId) internal view returns (address) {
        return market.hidden.enabledTokens.at(tokenId);
    }

    function hasEnabledToken(Market storage market, address token) internal view returns (bool) {
        return market.hidden.enabledTokens.contains(token);
    }

    function asset(Market storage market) internal view returns (address) {
        return market.hidden.asset;
    }

    function uniswapV2Factory(Market storage market) internal view returns (address) {
        return market.hidden.uniswapV2Factory;
    }

    function uniswapV2Router(Market storage market) internal view returns (address) {
        return market.hidden.uniswapV2Router;
    }

    function maximumSlippageAsBasisPoint(Market storage market) internal view returns (uint256 asBasisPoint) {
        return market.hidden.maximumSlippageAsBasisPoint;
    }

    function enableToken(Market storage market, address token) internal returns (Market storage) {
        market.hidden.enabledTokens.add(token);
        emit TokenEnabled(token);
        return market;
    }

    function disableToken(Market storage market, address token) internal returns (Market storage) {
        market.hidden.enabledTokens.remove(token);
        emit TokenDisabled(token);
        return market;
    }

    function setAsset(Market storage market, address token) internal returns (Market storage) {
        market.hidden.asset = token;
        emit ChangedMarketAsset(token);
        return market;
    }

    function setUniswapV2Factory(Market storage market, address uniswapV2Factory) internal returns (Market storage) {
        market.hidden.uniswapV2Factory = uniswapV2Factory;
        emit ChangedMarketUniswapV2Factory(uniswapV2Factory);
        return market;
    }

    function setUniswapV2Router(Market storage market, address uniswapV2Router) internal returns (Market storage) {
        market.hidden.uniswapV2Router = uniswapV2Router;
        emit ChangedMarketUniswapV2Router(uniswapV2Router);
        return market;
    }

    function setMaximumSlippageAsBasisPoint(Market storage market, uint256 maximumSlippageAsBasisPoint) internal returns (Market storage) {
        market.hidden.maximumSlippageAsBasisPoint = maximumSlippageAsBasisPoint;
        emit ChangedMarketMaximumSlippage(maximumSlippageAsBasisPoint);
        return market;
    }

    function buy(Market storage market, uint256 tokenId, uint256 amountInR64) internal returns (uint256 r64) {
        require(market.asset().balanceR64() >= amountInR64, "MarketStorageLib: insufficient assets");
        TradeActionLib.TradeWithSlippagePayload memory trade;
        trade.token = market.enabledTokens(tokenId);
        trade.asset = market.asset();
        trade.uniswapV2Factory = market.uniswapV2Factory();
        trade.uniswapV2Router = market.uniswapV2Router();
        trade.amountInR64 = amountInR64;
        trade.maximumSlippageAsBasisPoint = market.maximumSlippageAsBasisPoint();
        return trade.buyWithSlippageCheck();
    }

    function sell(Market storage market, uint256 tokenId, uint256 amountInR64) internal returns (uint256 r64) {
        require(market.enabledTokens(tokenId).balanceR64() >= amountInR64, "MarketStorageLib: insufficient tokens");
        TradeActionLib.TradeWithSlippagePayload memory trade;
        trade.token = market.enabledTokens(tokenId);
        trade.asset = market.asset();
        trade.uniswapV2Factory = market.uniswapV2Factory();
        trade.uniswapV2Router = market.uniswapV2Router();
        trade.amountInR64 = amountInR64;
        trade.maximumSlippageAsBasisPoint = market.maximumSlippageAsBasisPoint();
        return trade.sellWithSlippageCheck();
    }
}