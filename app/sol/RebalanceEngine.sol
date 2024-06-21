// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IERC20Metadata } from "./imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { IERC20 } from "./imports/openzeppelin/token/ERC20/IERC20.sol";
import { UniswapEngine } from "./UniswapEngine.sol";

contract RebalanceEngine is UniswapEngine {
    enum RebalanceEngineResult {
        OK,
        INSUFFICIENT_LIQUIDITY,
        INSUFFICIENT_INPUT_AMOUNT,
        ADDRESS_NOT_FOUND,
        MISSING_REQUIRED_DATA,
        SLIPPAGE_EXCEEDS_THRESHOLD,
        INSUFFICIENT_BALANCE,
        UNKNOWN_ERROR
    }

    struct Asset {
        RebalanceEngineResult result;
        /***/Exchange exchange;
        /***/address token;
        /***/address denomination;
        uint256 balance;
        uint8 decimals0;
        uint8 decimals1;
        TotalValue totalValue;
    }

    struct TotalValue {
        RebalanceEngineResult result;
        uint256 value;
    }

    function _fetchAssetData(Asset memory asset) internal view returns (Asset memory) {
        if (asset.token == address(0) || asset.denomination == address(0) || asset.exchange.factory == address(0) || asset.exchange.router == address(0)) {
            asset.result = RebalanceEngineResult.MISSING_REQUIRED_DATA;
            return asset;
        }
        Pair memory pair;
        pair.exchange.factory = asset.exchange.factory;
        pair.exchange.router = asset.exchange.router;
        pair.token0 = asset.token;
        pair.token1 = asset.denomination;
        pair.amountIn0 = _cast(IERC20(pair.token0).balanceOf(address(this)), IERC20Metadata(pair.token0).decimals(), 18);
        pair = _fetchPairData(pair);
        if (pair.result != UniswapEngineResult.OK) {
            asset.result = 
                pair.result == UniswapEngineResult.INSUFFICIENT_LIQUIDITY ? RebalanceEngineResult.INSUFFICIENT_LIQUIDITY :
                pair.result == UniswapEngineResult.INSUFFICIENT_INPUT_AMOUNT ? RebalanceEngineResult.INSUFFICIENT_INPUT_AMOUNT :
                pair.result == UniswapEngineResult.ADDRESS_NOT_FOUND ? RebalanceEngineResult.ADDRESS_NOT_FOUND :
                pair.result == UniswapEngineResult.MISSING_REQUIRED_DATA ? RebalanceEngineResult.MISSING_REQUIRED_DATA :
                pair.result == UniswapEngineResult.SLIPPAGE_EXCEEDS_THRESHOLD ? RebalanceEngineResult.SLIPPAGE_EXCEEDS_THRESHOLD :
                pair.result == UniswapEngineResult.INSUFFICIENT_BALANCE ? RebalanceEngineResult.INSUFFICIENT_BALANCE : RebalanceEngineResult.UNKNOWN_ERROR;
            return asset;
        }
        asset.result = RebalanceEngineResult.OK;
        asset.balance = _cast(IERC20(pair.token0).balanceOf(address(this)), IERC20Metadata(pair.token0).decimals(), 18);
        asset.totalValue.result = 
                pair.quote0.result == UniswapEngineResult.OK ? RebalanceEngineResult.OK :
                pair.quote0.result == UniswapEngineResult.INSUFFICIENT_LIQUIDITY ? RebalanceEngineResult.INSUFFICIENT_LIQUIDITY :
                pair.quote0.result == UniswapEngineResult.INSUFFICIENT_INPUT_AMOUNT ? RebalanceEngineResult.INSUFFICIENT_INPUT_AMOUNT :
                pair.quote0.result == UniswapEngineResult.ADDRESS_NOT_FOUND ? RebalanceEngineResult.ADDRESS_NOT_FOUND :
                pair.quote0.result == UniswapEngineResult.MISSING_REQUIRED_DATA ? RebalanceEngineResult.MISSING_REQUIRED_DATA :
                pair.quote0.result == UniswapEngineResult.SLIPPAGE_EXCEEDS_THRESHOLD ? RebalanceEngineResult.SLIPPAGE_EXCEEDS_THRESHOLD :
                pair.quote0.result == UniswapEngineResult.INSUFFICIENT_BALANCE ? RebalanceEngineResult.INSUFFICIENT_BALANCE : RebalanceEngineResult.UNKNOWN_ERROR;
        asset.totalValue.value = asset.balance == 0 ? 0 : pair.quote0.value;
        asset.decimals0 = pair.decimals0;
        asset.decimals1 = pair.decimals1;
        return asset;
    }
}