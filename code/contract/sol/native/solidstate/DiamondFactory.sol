// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./Diamond.sol";
import "../interface/IFacet.sol";
import "../interface/IVaultDiamond.sol";
import "../util/action/PaymentActionLib.sol";
import "../util/math/UintConversionMathLib.sol";

contract DiamondFactory {
    using UintConversionMathLib for UintConversionMathLib.ConversionPayload;
    using PaymentActionLib for address;

    struct Preset {
        address authFacet;
        address managerAccessFacet;
        address marketFacet;
        address partialERC4626Facet;
        address rootAccessFacet;
        address tokenFacet;
        address[] enabledTokens;
        address asset;
        address uniswapV2Factory;
        address uniswapV2Router;
        uint256 maximumSlippageAsBasisPoint;
    }

    Preset private preset;

    constructor(
        address authFacet,
        address managerAccessFacet,
        address marketFacet,
        address partialERC4626Facet,
        address rootAccessFacet,
        address tokenFacet,
        address[] enabledTokens,
        address asset,
        address uniswapV2Factory,
        address uniswapV2Router,
        uint256 maximumSlippageAsBasisPoint
    ) {
        preset = 
            Preset({
                authFacet:                       authFacet,
                managerAccessFacet:              managerAccessFacet,
                marketFacet:                     marketFacet,
                partialERC4626Facet:             partialERC4626Facet,
                rootAccessFacet:                 rootAccessFacet,
                tokenFacet:                      tokenFacet,
                enabledTokens:                   enabledTokens,
                asset:                           asset,
                uniswapV2Factory:                uniswapV2Factory,
                uniswapV2Router:                 uniswapV2Router,
                maximumSlippageAsBasisPoint:     maximumSlippageAsBasisPoint
            });
    }

    struct DeployementPayload {
        address authFacet;
        address managerAccessFacet;
        address marketFacet;
        address partialERC4626Facet;
        address rootAccessFacet;
        address tokenFacet;
        address[] enabledTokens;
        address asset;
        address uniswapV2Factory;
        address uniswapV2Router;
        uint256 maximumSlippageAsBasisPoint;
        string name;
        string symbol;
    }

    function deploy(DeployementPayload memory p) public returns (address) {
        Diamond memory diamond = new Diamond();
        diamond.install(p.authFacet);
        diamond.install(p.managerAccessFacet);
        diamond.install(p.marketFacet);
        diamond.install(p.partialERC4626Facet);
        diamond.install(p.rootAccessFacet);
        diamond.install(p.tokenFacet);
        IVaultDiamond vaultDiamond = IVaultDiamond(address(diamond));
        vaultDiamond.claim();
        vaultDiamond.setName(p.name);
        vaultDiamond.setSymbol(p.symbol);
        vaultDiamond.setAsset(p.asset);
        vaultDiamond.setUniswapV2Factory(p.uniswapV2Factory);
        vaultDiamond.setUniswapV2Router(p.uniswapV2Router);
        vaultDiamond.setMaximumSlippageAsBasisPoint(p.maximumSlippageAsBasisPoint);
        UintConversionMathLib.ConversionPayload memory conversion = 
            UintConversionMathLib.ConversionPayload({
                value:           100,
                oldDecimals:     2,
                newDecimals:     64
            });
        p.asset.requestToken(conversion.asNew());
        vaultDiamond.liqLock();
        for (uint256 i = 0; i < p.enabledTokens.length; i++) {
            vaultDiamond.enableToken(p.enabledTokens[i]);
        }
        vaultDiamond.grantRoleTo("managers", msg.sender);
        return address(diamond);
    }

    function preset(string memory name, string memory symbol) external returns (address) {
        DeploymentPayload memory p = 
            DeploymentPayload({
                authFacet:                       preset.authFacet,
                managerAccessFacet:              preset.managerAccessFacet,
                marketFacet:                     preset.marketFacet,
                partialERC4626Facet:             preset.partialERC4626Facet,
                rootAccessFacet:                 preset.rootAccessFacet,
                tokenFacet:                      preset.tokenFacet,
                enabledTokens:                   preset.enabledTokens,
                asset:                           preset.asset,
                uniswapV2Factory:                preset.uniswapV2Factory,
                uniswapV2Router:                 preset.uniswapV2Router,
                maximumSlippageAsBasisPoint:     preset.maximumSlippageAsBasisPoint,
                name:                            name,
                symbol:                          symbol
            });
        return deploy(p);
    }
}