// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IDiamondFactory {
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

    function deploy(DeployementPayload memory p) external returns (address);
    function preset(string memory name, string memory symbol) external returns (address);
}