// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import '../util/FinanceMathLibrary.sol';
import './asset/TokenStorage.sol';


library VaultStorageLibrary {
    using TokenStorageLibrary for TokenStorageLibrary.Token;

    struct Vault {
        Hidden hidden;
    }

    struct Hidden {
        address[] holdings;
        address asset;
        address uniswapV2Factory;
        address uniswapV2Router02;
    }

    function holdings(Vault storage vault, uint256 tokenId) internal view returns (address) {
        return vault.hidden.holdings[tokenId];
    }

    function holdings(Vault storage vault) internal view returns (address[] storage) {
        return vault.hidden.holdings;
    }

    function asset(Vault storage vault) internal view returns (address) {
        return vault.hidden.asset;
    }

    function uniswapV2Factory(Vault storage vault) internal view returns (address) {
        return vault.hidden.uniswapV2Factory;
    }

    function uniswapV2Router02(Vault storage vault) internal view returns (address) {
        return vault.hidden.uniswapV2Router02;
    }

    function totalAssets(Vault storage vault) internal view returns (uint256 asEther) {
        return FinanceMathLibrary.netAssetValue(holdings(vault), asset(vault), uniswapV2Factory(vault), uniswapV2Router02(vault));
    }

    function convertToAssets(TokenStorageLibrary.Token storage shares, uint256 sharesInAsEther) internal view returns (uint256 asEther) {
        return FinanceMathLibrary.convertToAssets(sharesInAsEther, totalAssets(vault), shares.totalSupply());
    }

    function convertToShares(TokenStorageLibrary.Token storage shares, uint256 assetsInAsEther) internal view returns (uint256 asEther) {
        return FinanceMathLibrary.convertToShares(assetsInAsEther, totalAssets(vault), shares.totalSupply());
    }
}