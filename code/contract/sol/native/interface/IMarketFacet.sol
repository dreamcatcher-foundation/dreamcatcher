// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./IFacet.sol";

interface IMarketFacet is IFacet {
    function enabledTokens() external view returns (address[] memory);
    function enabledTokens(uint256 tokenId) external view returns (address);
    function hasEnabledToken(address token) external view returns (bool);
    function asset() external view returns (address);
    function uniswapV2Factory() external view returns (address);
    function uniswapV2Router() external view returns (address);
    function maximumSlippageAsBasisPoint() external view returns (uint256 asBasisPoint);
}