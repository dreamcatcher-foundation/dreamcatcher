// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../adaptor/UniswapV2PairAdaptorLib.sol";
import "../adaptor/TokenAddressAdaptorLib.sol";

library FinanceMathLib {
    using TokenAddressAdaptorLib for address;

    struct Payload {
        address[] tokensOwned;
        address asset;
        address uniswapV2Factory;
        address uniswapV2Router;
    }

    function bestNetAssetValueWithoutAssetBalance(Payload memory payload) internal view returns (uint256 r64) {
        for (uint256 i = 0; i < payload.tokensOwned.length; i++) {
            UniswapV2PairAdaptorLib.Payload memory adaptorPayload;
            adaptorPayload.token0 = payload.tokensOwned[i];
            adaptorPayload.token1 = payload.asset;
            adaptorPayload.uniswapV2Factory = payload.uniswapV2Factory;
            adaptorPayload.uniswapV2Router = payload.uniswapV2Router;
            uint256 balanceR64 = payload.tokensOwned[i].balanceR64();
            uint256 priceR64 = UniswapV2PairAdaptorLib.priceR64(adaptorPayload);
            r64 += balanceR64 * priceR64;
        }
        return r64;
    }

    function realNetAssetValueWithoutAssetBalance(Payload memory payload) internal view returns (uint256 r64) {
        for (uint256 i = 0; i < payload.tokensOwned.length; i++) {
            UniswapV2PairAdaptorLib.PathPayload memory adaptorPayload;
            adaptorPayload.path[0] = payload.tokensOwned[i];
            adaptorPayload.path[1] = payload.asset;
            adaptorPayload.uniswapV2Factory = payload.uniswapV2Factory;
            adaptorPayload.uniswapV2Router = payload.uniswapV2Router;
            adaptorPayload.amountInR64 = payload.tokensOwned[i].balanceR64();
            r64 += UniswapV2PairAdaptorLib.amountOutR64(adaptorPayload);
        }
        return r64;
    }

    function bestNetAssetValue(Payload memory payload) internal view returns (uint256 r64) {
        r64 += bestNetAssetValueWithoutAssetBalance(payload);
        r64 += payload.asset.balanceR64();
        return r64;
    }

    function realNetAssetValue(Payload memory payload) internal view returns (uint256 r64) {
        r64 += realNetAssetValueWithoutAssetBalance(payload);
        r64 += payload.asset.balanceR64();
        return r64;
    }

    struct LiquidityCheckPayload {
        uint256 assetsInR64;
        address token;
        address asset;
        address uniswapV2Factory;
        address uniswapV2Router;
        uint256 threshold;
    }

    function hasEnoughLiquidity(LiquidityCheckPayload memory payload) internal view returns (bool) {
        address[] memory path = new address[](2);
        path[0] = payload.token;
        path[1] = payload.asset;
        UniswapV2PairAdaptorLib.Payload memory adaptorPayload;
        adaptorPayload.token0 = payload.token;
        adaptorPayload.token1 = payload.asset;
        adaptorPayload.uniswapV2Factory = payload.uniswapV2Factory;
        adaptorPayload.uniswapV2Router = payload.uniswapV2Factory;
        uint256 priceR64 = UniswapV2PairAdaptorLib.priceR64(adaptorPayload);
        if (priceR64 == 0) {
            return false;
        }
        uint256 amountInR64 = payload.assetsInR64 / priceR64;
        UniswapV2PairAdaptorLib.PathPayload memory adaptorPathPayload;
        adaptorPathPayload.path = path;
        adaptorPathPayload.uniswapV2Factory = payload.uniswapV2Factory;
        adaptorPathPayload.uniswapV2Router = payload.uniswapV2Router;
        adaptorPathPayload.amountInR64 = amountInR64;
        uint256 slippage = UniswapV2PairAdaptorLib.slippage(adaptorPathPayload);
        if (slippage > payload.threshold) {
            return false;
        }
        return true;
    }
}