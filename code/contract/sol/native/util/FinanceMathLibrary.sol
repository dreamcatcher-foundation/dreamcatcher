// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import './UniswapV2PairLibrary.sol';
import './ConversionMathLibrary.sol';
import '../../non-native/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol';
import '../../non-native/openzeppelin/token/ERC20/IERC20.sol';

library FinanceMathLibrary {
    using ConversionMathLibrary for uint256;

    function convertToAssets(uint256 sharesInAsEther, uint256 netAssetValueAsEther, uint256 totalSupplyAsEther) internal pure returns (uint256 asEther) {
        return (sharesInAsEther * netAssetValueAsEther) / totalSupplyAsEther;
    }

    function convertToShares(uint256 assetsInAsEther, uint256 netAssetValueAsEther, uint256 totalSupplyAsEther) internal pure returns (uint256 asEther) {
        return (assetsInAsEther * totalSupplyAsEther) / netAssetValueAsEther;
    }

    function netAssetValueExcludingAssetBalance(address[] memory holdings, address asset, address uniswapV2Factory, address uniswapV2Router02) internal view returns (uint256 asEther) {
        for (uint256 i = 0; i < holdings.length; i++) {
            address token = holdings[i];
            uint256 tokenBalance = IERC20(token).balanceOf(address(this));
            uint256 tokenBalanceAsEther = tokenBalance.fromNonNativeDecimalsToEther(IERC20Metadata(token).decimals());
            uint256 quoteAsEther = UniswapV2PairLibrary.quote(token, asset, uniswapV2Factory,uniswapV2Router02);
            asEther += tokenBalanceAsEther * quoteAsEther;
        } 
        return asEther;
    }

    function netAssetValue(address[] memory holdings, address asset, address uniswapV2Factory, address uniswapV2Router02) internal view returns (uint256 asEther) {
        asEther += netAssetValueExcludingAssetBalance(holdings, asset, uniswapV2Factory, uniswapV2Router02);
        uint256 assetBalance = IERC20(asset).balanceOf(address(this));
        uint256 assetBalanceAsEther = assetBalance.fromNonNativeDecimalsToEther(IERC20Metadata(asset).decimals());
        asEther += assetBalanceAsEther;
        return asEther;
    }

    function buy(address[] memory holdings, address asset, address uniswapV2Factory, address uniswapV2Router02, address token, uint256 assetAmountInAsEther) internal returns (uint256 asEther) {
        address[] memory path = new address[](2);
        path[0] = asset;
        path[1] = token;
        return UniswapV2PairLibrary.swap(path, uniswapV2Factory, uniswapV2Router02, assetAmountInAsEther);
    }

    function sell(address[] memory holdings, address asset, address uniswapV2Factory, address uniswapV2Router02, address token, uint256 tokenAmountInAsEther) internal returns (uint256 asEther) {
        address[] memory path = address[](2);
        path[0] = token;
        path[1] = asset;
        return UniswapV2PairLibrary.swap(path, uniswapV2Factory, uniswapV2Router02, tokenAmountInAsEther);
    }

    function buyWithSlippageRequirement(address[] memory holdings, address asset, address uniswapV2Factory, address uniswapV2Router02, address token, uint256 assetAmountInAsEther, uint256 maximumSlippageAsBasisPoint) internal returns (uint256 asEther) {
        address[] memory path = new address[](2);
        path[0] = asset;
        path[1] = token;
        return UniswapV2PairLibrary.swapWithMaximumSlippageRequirement(
            path, 
            uniswapV2Factory, 
            uniswapV2Router02, 
            assetAmountInAsEther, 
            maximumSlippageAsBasisPoint);
    }

    function sellWithSlippageRequirement(address[] memory holdings, address asset, address uniswapV2Factory, address uniswapV2Router02, address token, uint256 tokenAmountInAsEther, uint256 maximumSlippageAsBasisPoint) internal returns (uint256 asEther) {
        address[] memory path = address[](2);
        path[0] = token;
        path[1] = asset;
        return UniswapV2PairLibrary.swapWithMaximumSlippageRequirement(
            path, 
            uniswapV2Factory, 
            uniswapV2Router02, 
            tokenAmountInAsEther, 
            maximumSlippageAsBasisPoint);
    }
}