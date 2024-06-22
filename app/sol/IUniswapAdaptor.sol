// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Pair } from "./Pair.sol";
import { QuoteResult } from "./QuoteResult.sol";
import { BalanceQueryResult } from "./BalanceQueryResult.sol";
import { SwapRequest } from "./SwapRequest.sol";
import { Asset } from "./Asset.sol";

interface IUniswapAdaptor {
    function getQuote(Pair memory pair, uint256 amountIn) external view returns (QuoteResult memory);
    function getBalanceSheet(Pair memory pair, uint256 targetWeight, uint256 totalAssets) external view returns (BalanceQueryResult memory);
    function getPair(Asset memory asset) external view returns (Pair memory);
    function swap(SwapRequest memory request) external returns (uint256);
}