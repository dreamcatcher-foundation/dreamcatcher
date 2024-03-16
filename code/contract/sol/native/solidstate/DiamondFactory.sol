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

    struct DeploymentPayload {
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

    function deploy(DeploymentPayload memory p) public returns (address) {
        Diamond diamond = new Diamond();
        diamond.install(p.authFacet);
        diamond.install(p.managerAccessFacet);
        diamond.install(p.marketFacet);
        diamond.install(p.partialERC4626Facet);
        diamond.install(p.rootAccessFacet);
        diamond.install(p.tokenFacet);
        IVaultDiamond vaultDiamond = IVaultDiamond(payable(address(diamond)));
        vaultDiamond.claim();
        vaultDiamond.setName(p.name);
        vaultDiamond.setSymbol(p.symbol);
        vaultDiamond.setAsset(p.asset);
        vaultDiamond.setUniswapV2Factory(p.uniswapV2Factory);
        vaultDiamond.setUniswapV2Router(p.uniswapV2Router);
        vaultDiamond.setMaximumSlippageAsBasisPoint(p.maximumSlippageAsBasisPoint);
        UintConversionMathLib.ConversionPayload memory conversion = 
            UintConversionMathLib.ConversionPayload({
                value: 100,
                oldDecimals: 2,
                newDecimals: 64
            });
        p.asset.requestToken(conversion.asNew());
        vaultDiamond.liqLock();
        for (uint256 i = 0; i < p.enabledTokens.length; i++) {
            vaultDiamond.enableToken(p.enabledTokens[i]);
        }
        vaultDiamond.grantRoleTo("managers", msg.sender);
        return address(diamond);
    }
}