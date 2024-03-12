// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../imports/openzeppelin/token/ERC20/IERC20.sol";
import "../imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import "../imports/openzeppelin/utils/structs/EnumerableSet.sol";

library PublicVaultClass {
    using EnumerableSet for EnumerableSet.AddressSet;

    struct PublicVault {
        EnumerableSet.AddressSet _tokenContractsBeingTracked;
        mapping(address => uint) _amountOfTokenHeld;
        uint _maximumNumberOfTokenContractsThatCanBeTracked;
        address _oracleContract;
    }

    event TheVaultHasStartedTrackingATokenContract();

    event TheVaultHasStoppedTrackingATokenContract();

    event TheVaultHasWhitelistedAnAccount();

    event TheVaultHasBlacklistedAnAccount();



    error TheVaultCannotSupportAnyMoreTokenContracts();

    error ThisAddressCannotInteractWithTheVaultBecauseItHasBeenBlacklisted();



    function tokenContractsBeingTracked(Vault storage vault, uint index) internal view returns (address) {
        return vault._tokenContractsBeingTracked.at(index);
    }

    function tokenContractsBeingTracked(Vault storage vault) internal view returns (address[] memory) {
        return vault._tokenContractsBeingTracked.values();
    }

    function numberOfTokenContractsBeingTracked(Vault storage vault) internal view returns (uint) {
        return vault._tokenContractsBeingTracked.length();
    }

    function amountOfTokenHeld(Vault storage vault, address tokenContract) internal view returns (uint) {
        return vault._amountOfTokenHeld[tokenContract];
    }

    function maximumNumberOfTokenContractsThatCanBeTracked(Vault storage vault) internal view returns (uint) {
        return vault._maximumNumberOfTokenContractsThatCanBeTracked;
    }

    function oracleContract(Vault storage vault) internal view returns (address) {
        return vault._oracleContract;
    }

    function totalValueInAssetsHeld(Vault storage vault) internal view returns (address) {
        
    }

    function _requireThatTheNumberOfTokenContractsBeingTrackedIsBelowOrAtTheMaximum(Vault storage vault) private view returns (bool) {
        if (numberOfTokenContractsBeingTracked(vault) > maximumNumberOfTokenContractsThatCanBeTracked(vault)) {
            revert TheVaultCannotSupportAnyMoreTokenContracts();
        }
        return true;
    }

    function _trackTokenContract(Vault storage vault, address tokenContract) private returns (bool) {
        vault._tokenContractsBeingTracked.add(tokenContract);
        _requireThatTheNumberOfTokenContractsBeingTrackedIsBelowOrAtTheMaximum(vault);
        emit TheVaultHasStartedTrackingATokenContract();
        return true;
    }

    function _stopTrackingTokenContract(Vault storage vault, address tokenContract) private returns (bool) {
        vault._tokenContractsBeingTracked.remove(tokenContract);
        emit TheVaultHasStoppedTrackingATokenContract();
        return true;
    }

    
}