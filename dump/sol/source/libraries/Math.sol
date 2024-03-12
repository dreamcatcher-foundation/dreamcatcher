// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library Math {

    /**
    * decimals 18 => ?
     */
    function convertFrom18DecimalsToAnyDecimals(uint number, uint8 decimals) internal pure returns (uint) {
        return ((number * (10 ** 18) / (10 ** 18)) * (10 ** decimals)) / (10 ** 18);
    }

    /**s
    * decimals ? => 18
     */
    function convertFromAnyDecimalsTo18Decimals(uint number, uint8 decimals) internal pure returns (uint) {
        return ((number * (10 ** 18) / (10 ** decimals)) * (10 ** 18)) / (10 ** 18);
    }

    function getNumberOfSharesToMint(
        uint valueOfAssetsSent, 
        uint valueOfAssetsInTheVaultBeforeMint, 
        uint numberOfSharesSentByTheVaultBeforeMint
    ) internal pure returns (uint) {
        return (valueOfAssetsSent)
    }

    function getValueOfAssetsToSend(
        uint numberOfSharesSent,
        uint valueOfAssetsInTheVaultBeforeTheWithdrawal,
        uint numberOfSharesSentByTheVaultBeforeTheWithdrawal
    ) internal pure returns (uint) {

    }
}