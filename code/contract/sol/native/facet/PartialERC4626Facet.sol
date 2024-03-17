// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../storage/MarketStorage.sol";
import "../util/math/FinanceMathLib.sol";
import "../util/math/ShareMathLib.sol";
import "../storage/asset/TokenStorage.sol";
import "../util/action/PaymentActionLib.sol";
import "../util/action/RedeemActionLib.sol";

contract PartialERC4626Facet is MarketStorage, TokenStorage {
    using MarketStorageLib for MarketStorageLib.Market;
    using FinanceMathLib for FinanceMathLib.Payload;
    using ShareMathLib for ShareMathLib.Payload;
    using TokenStorageLib for TokenStorageLib.Token;
    using PaymentActionLib for address;
    using RedeemActionLib for RedeemActionLib.RedeemPayload;

    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory response = new bytes4[](6);
        response[0] = bytes4(keccak256("totalAssets()"));
        response[1] = bytes4(keccak256("realTotalAssets()"));
        response[2] = bytes4(keccak256("convertToShares(uint256)"));
        response[3] = bytes4(keccak256("convertToAssets(uint256)"));
        response[4] = bytes4(keccak256("deposit(uint256)"));
        response[5] = bytes4(keccak256("redeem(uint256)"));
        return response;
    }

    function totalAssets() external view returns (uint256 r64) {
        FinanceMathLib.Payload memory payload;
        payload.tokensOwned = market().enabledTokens();
        payload.asset = market().asset();
        payload.uniswapV2Factory = market().uniswapV2Factory();
        payload.uniswapV2Router = market().uniswapV2Router();
        return payload.bestNetAssetValue();
    }

    function realTotalAssets() external view returns (uint256 r64) {
        FinanceMathLib.Payload memory payload;
        payload.tokensOwned = market().enabledTokens();
        payload.asset = market().asset();
        payload.uniswapV2Factory = market().uniswapV2Factory();
        payload.uniswapV2Router = market().uniswapV2Router();
        return payload.realNetAssetValue();
    }

    function convertToShares(uint256 assetsInR64) external view returns (uint256 r64) {
        FinanceMathLib.Payload memory financePayload;
        financePayload.tokensOwned = market().enabledTokens();
        financePayload.asset = market().asset();
        financePayload.uniswapV2Factory = market().uniswapV2Factory();
        financePayload.uniswapV2Router = market().uniswapV2Router();
        uint256 bestNetAssetValueR64 = financePayload.bestNetAssetValue();
        ShareMathLib.Payload memory payload;
        payload.assetsOrSharesInR64 = assetsInR64;
        payload.totalAssetsR64 = bestNetAssetValueR64;
        payload.totalSupplyR64 = token().totalSupply();
        return payload.asShares();
    }

    function convertToAssets(uint256 sharesInR64) external view returns (uint256 r64) {
        FinanceMathLib.Payload memory financePayload;
        financePayload.tokensOwned = market().enabledTokens();
        financePayload.asset = market().asset();
        financePayload.uniswapV2Factory = market().uniswapV2Factory();
        financePayload.uniswapV2Router = market().uniswapV2Router();
        uint256 bestNetAssetValueR64 = financePayload.bestNetAssetValue();
        ShareMathLib.Payload memory payload;
        payload.assetsOrSharesInR64 = sharesInR64;
        payload.totalAssetsR64 = bestNetAssetValueR64;
        payload.totalSupplyR64 = token().totalSupply();
        return payload.asShares();
    }

    function deposit(uint256 assetsInR64) external returns (uint256 r64) {
        FinanceMathLib.Payload memory financePayload;
        financePayload.tokensOwned = market().enabledTokens();
        financePayload.asset = market().asset();
        financePayload.uniswapV2Factory = market().uniswapV2Factory();
        financePayload.uniswapV2Router = market().uniswapV2Router();
        uint256 bestNetAssetValueR64 = financePayload.bestNetAssetValue();
        ShareMathLib.Payload memory payload;
        payload.assetsOrSharesInR64 = assetsInR64;
        payload.totalAssetsR64 = bestNetAssetValueR64;
        payload.totalSupplyR64 = token().totalSupply();
        uint256 mintAmountR64 = payload.asShares();
        market().asset().requestToken(assetsInR64);
        token().mint(msg.sender, mintAmountR64);
        return mintAmountR64;
    }

    function redeem(uint256 sharesInR64) external returns (bool) {
        uint256 ownershipAsBasisPoint = (sharesInR64 / token().totalSupply()) * 10000;
        for (uint256 i = 0; i < market().enabledTokens().length; i++) {
            RedeemActionLib.RedeemPayload memory redeem;
            redeem.token = market().enabledTokens(i);
            redeem.asset = market().asset();
            redeem.uniswapV2Factory = market().uniswapV2Factory();
            redeem.uniswapV2Router = market().uniswapV2Router();
            redeem.ownershipAsBasisPoint = ownershipAsBasisPoint;
            redeem.maximumSlippageAsBasisPoint = market().maximumSlippageAsBasisPoint();
            redeem.redeem();
        }
        return true;
    }
}