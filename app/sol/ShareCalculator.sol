// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { FixedPointCalculator } from "./FixedPointCalculator.sol";

contract ShareCalculator is FixedPointCalculator {
    function _amountToMint(uint256 assetsIn, uint256 totalAssets, uint256 totalSupply) internal pure returns (uint256) {

        /**
        * There are no asseets in the vault and no supply in circulation. when
        * both values are insufficient to perform the operation, the function will 
        * handle this by returning an initial amount of `1,000,000`.
        *
        * Typically the initial state of the vault when first deployed.
         */
        if (totalAssets == 0 && totalSupply == 0) return _initialMint();

        /**
        * There are not assets in the vault but no supply to claim it. The function will
        * handle this by returning an initial amount of `1,000,000`.
        *
        * The vault may arrive in this state if assets have been transferred in
        * without minting any supply.
         */
        if (totalAssets != 0 && totalSupply == 0) return _initialMint();

        if (totalAssets == 0 && totalSupply != 0) return 0;

        return _div(_mul(assetsIn, totalSupply, 18, 18), totalAssets, 18, 18);
    }

    function _amountToSend(uint256 supplyIn, uint256 totalAssets, uint256 totalSupply) internal pure returns (uint256) {
        
        if (totalAssets == 0 && totalSupply == 0) return 0;

        if (totalAssets != 0 && totalSupply == 0) return 0;

        if (totalAssets == 0 && totalSupply != 0) return 0;

        return _div(_mul(supplyIn, totalAssets, 18, 18), totalSupply, 18, 18);
    }

    function _initialMint() private pure returns (uint256) {
        return 1000000 * (10**decimals);
    }
}