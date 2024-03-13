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

    /**
     * @dev Calculates the best net asset value without considering the balance of the asset itself.
     * @param payload The payload containing token balances and exchange details.
     * @return r64 The best net asset value in Dreamcatcher native r64 representation.
     */
    function bestNetAssetValueWithoutAssetBalance(Payload payload) internal view returns (uint r64) {
        for (uint i = 0; i < payload.tokensOwned.length; i++) {
            UniswapV2PairAdaptorLib.Payload adaptorPayload;
            adaptorPayload.token0 = payload.tokensOwned[i];
            adaptorPayload.token1 = payload.asset;
            adaptorPayload.uniswapV2Factory = payload.uniswapV2Factory;
            adaptorPayload.uniswapV2Router = payload.uniswapV2Router;
            uint balanceR64 = payload.tokensOwned[i].balanceR64();
            uint priceR64 = UniswapV2PairAdaptorLib.priceR64(adaptorPayload);
            r64 += balanceR64 * priceR64;
        }
        return r64;
    }

    /**
     * @dev Calculates the real net asset value without considering the balance of the asset itself.
     * @param payload The payload containing token balances and exchange details.
     * @return r64 The real net asset value in Dreamcatcher native r64 representation.
     */
    function realNetAssetValueWithoutAssetBalance(Payload payload) internal view returns (uint r64) {
        for (uint i = 0; i < payload.tokensOwned.length; i++) {
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

    /**
     * @dev Calculates the best net asset value considering the balance of the asset itself.
     * @param payload The payload containing token balances and exchange details.
     * @return r64 The best net asset value in Dreamcatcher native r64 representation.
     */
    function bestNetAssetValue(Payload payload) internal view returns (uint r64) {
        r64 += bestNetAssetValueWithoutAssetBalance(payload);
        r64 += payload.asset.balanceR64();
        return r64;
    }

    /**
     * @dev Calculates the real net asset value considering the balance of the asset itself.
     * @param payload The payload containing token balances and exchange details.
     * @return r64 The real net asset value in Dreamcatcher native r64 representation.
     */
    function realNetAssetValue(Payload payload) internal view returns (uint r64) {
        r64 += realNetAssetValueWithoutAssetBalance(payload);
        r64 += payload.asset.balanceR64();
        return r64;
    }

    struct LiquidityCheckPayload {
        uint assetsInR64;
        address token;
        address asset;
        address uniswapV2Factory;
        address uniswapV2Router;
        uint threshold;
    }

    /**
     * @dev Checks if there is enough liquidity in a Uniswap V2 pair to perform a trade.
     * @param payload The payload containing information about the liquidity check:
     *   - assetsInR64: The amount of assets in r64 (Dreamcatcher native representation).
     *   - token: The address of the token being traded.
     *   - asset: The address of the asset being traded against.
     *   - uniswapV2Factory: The address of the Uniswap V2 factory contract.
     *   - uniswapV2Router: The address of the Uniswap V2 router contract.
     *   - threshold: The maximum acceptable slippage threshold, represented as a basis point (0.01%).
     * @return A boolean indicating whether there is enough liquidity to perform the trade without exceeding the threshold.
     */
    function hasEnoughLiquidity(LiquidityCheckPayload payload) internal view returns (bool) {
        address[] memory path = new address[](2);
        path[0] = payload.token;
        path[1] = payload.asset;
        UniswapV2PairLibrary.Payload memory adaptorPayload;
        adaptorPayload.token0 = payload.token;
        adaptorPayload.token1 = payload.asset;
        adaptorPayload.uniswapV2Factory = payload.uniswapV2Factory;
        adaptorPayload.uniswapV2Router = payload.uniswapV2Factory;
        uint priceR64 = UniswapV2PairLibrary.priceR64(adaptorPayload);
        if (priceR64 == 0) {
            return false;
        }
        uint amountInR64 = payload.assetsInR64 / priceR64
        UniswapV2PairLibrary.PathPayload memory adaptorPathPayload;
        adaptorPathPayload.path = path;
        adaptorPathPayload.uniswapV2Factory = payload.uniswapV2Factory;
        adaptorPathPayload.uniswapV2Router = payload.uniswapV2Router;
        adaptorPathPayload.amountInR64 = amountInR64;
        uint slippage = UniswapV2PairLibrary.slippage(adaptorPathPayload);
        if (slippage > payload.threshold) {
            return false;
        }
        return true;
    }
}