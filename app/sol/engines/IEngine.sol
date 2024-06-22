// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IEngine {
    function getMintAmount(uint256 assetsIn, uint256 totalAssets, uint256 totalSupply) external pure returns (uint256);
    function getSendAmount(uint256 supplyIn, uint256 totalAssets, uint256 totalSupply) external pure returns (uint256);
    function getBalanceSheet()
    function getQuote(Pair memory pair, uint256 amountIn) external view returns (QuoteResult memory result);
    function getPair(Asset memory asset) external view returns (Pair memory pair);
}