// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Vault } from "./Vault.sol";
import { UniswapV2MarketSwapperLib } from "../../../lib/UniswapV2MarketSwapperLib.sol";
import { UniswapV2Market } from "../../../struct/UniswapV2Market.sol";

library VaultLib {
    using UniswapV2MarketSwapperLib for UniswapV2Market;
    using VaultLib for Vault;

    error TooManyTokensAreBeingTracked();

    function trackedTokens(Vault storage vault, uint256 key) internal view returns (address) {
        return vault.inner.trackedTokens.at(key);
    }

    function trackedTokens(Vault storage vault) internal view returns (address[] memory) {
        return vault.inner.trackedTokens.values();
    }

    function trackedTokensLength(Vault storage vault) internal view returns (uint256) {
        return vault.inner.trackedTokens.length();
    }

    function maxTrackedTokens(Vault storage vault) internal view returns (uint256) {
        return vault.inner.maxTrackedTokens;
    }

    function trackToken(Vault storage vault, address token) internal {
        if (vault.trackedTokensLength() >= vault.maxTrackedTokens()) {
            revert TooManyTokensAreBeingTracked();
        }
        vault.inner.trackedTokens.add(token);
    }

    function untrackToken(Vault storage vault, address token) internal {
        
    }

    function swap(Vault storage vault) {
        vault.inner.uniswapV2Market.swap()
    }
}