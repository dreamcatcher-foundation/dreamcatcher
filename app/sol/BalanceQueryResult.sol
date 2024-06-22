// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct BalanceQueryResult {
    uint256 actualWeight;
    uint256 targetWeight;
    uint256 actualBalance;
    uint256 targetBalance;
    uint256 actualValue;
    uint256 targetValue;
    uint256 surplusBalance;
    uint256 deficitBalance;
    uint256 surplusValue;
    uint256 deficitValue;
    uint256 totalAssets;
}