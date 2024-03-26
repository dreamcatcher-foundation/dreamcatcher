// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import './FixedPointValueToolkit.sol';

error TokenizedVaultToolkit__ShouldNotMintWhilstBankrupt();
error TokenizedVaultToolkit__PhantomSupply();
error TokenizedVaultToolkit__SupplyWouldBeRedeemedWorthless();

/**
* -> If the fixed point values are not of the same decimal type
*    then it will be caught at the end of the function during
*    the fixed point math operation.
 */
function _simulateAmountToMintUsingTokenizedVaultToolkit(FixedPointValue memory assetsIn, FixedPointValue memory assets, FixedPointValue memory supply) pure returns (FixedPointValue memory asEther) {
    assetsIn = _getAsEtherUsingFixedPointValueToolkit(assetsIn);
    assets = _getAsEtherUsingFixedPointValueToolkit(assets);
    supply = _getAsEtherUsingFixedPointValueToolkit(supply);
    
    /**
    * -> In this scenario there are not assets in the vault and no supply
    *    in circulation. When both values are insufficient to perform
    *    the operation, the function will handle this by returning an
    *    initial amount of '1,000,000' in the assetsIn 'decimals'.
    *
    * -> This is the initial state vaults are going to be in when they
    *    are first deployed. However, it is possible to arrive at
    *    this state if all supply has been burnt.
        */
    if (assets.value == 0 && supply.value == 0) return _initialMintUsingTokenizedVaultToolkit(assetsIn.decimals);

    /**
    * -> In this scenario there are assets in the vault but no supply
    *    to claim it. The function responds with the initial amount of
    *    '1,000,000' in the assetsIn 'decimals'.
    *
    * -> There are edge cases where the vault can arrive to this state
    *    when the assets have been transferred in.
        */
    if (assets.value != 0 && supply.value == 0) return _initialMintUsingTokenizedVaultToolkit(assetsIn.decimals);

    /**
    * -> In this scenario there are not assets in the vault but there is
    *    supply to claim it.
    *
    * -> This may happen if all the assets have become worthless. This can
    *    happen if the vault has become bankrupt, or if tthere are assets that are not
    *    tracked by the vault.
    *
    * -> The function will revert as minting shares in this scenario
    *    should not be allowed, to safe-guard any future depositors.
    *
    * -> To exit this state, an external influx of assets must be
    *    deposited to the vault.
        */
    if (assets.value == 0 && supply.value != 0) revert TokenizedVaultToolkit__ShouldNotMintWhilstBankrupt();

    /**
    * -> As all the possible edge cases have been handled the operation
    *    can now compute the response normally.
        */
    return _divUsingFixedPointValueToolkit(_mulUsingFixedPointValueToolkit(assetsIn, supply, 18), assets, 18);
}

/**
* -> If the fixed point values are not of the same decimal type
*    then it will be caught at the end of the function during
*    the fixed point math operation.
 */
function _simulateAmountToSendUsingTokenizedVaultToolkit(FixedPointValue memory supplyIn, FixedPointValue memory assets, FixedPointValue memory supply) pure returns (FixedPointValue memory asEther) {
    supplyIn = _getAsEtherUsingFixedPointValueToolkit(supplyIn);
    assets = _getAsEtherUsingFixedPointValueToolkit(assets);
    supply = _getAsEtherUsingFixedPointValueToolkit(supply);

    /**
    * -> A redundant check to ensure that the amount of supply in
    *    actually exists.
        */
    if (supplyIn.value > supply.value) revert TokenizedVaultToolkit__PhantomSupply();

    /**
    * -> In this scenario there is no value in the vault and no supply
    *    in circulation.
    *
    * -> This is the initial state of any vault. It is also possible to
    *    arrive to this state if all supply has perfectly claimed
    *    all assets.
    *
    * -> Logically the supply does not exist and therefore cannot
    *    redeem anything.
        */
    if (assets.value == 0 && supply.value == 0) revert TokenizedVaultToolkit__PhantomSupply();

    /**
    * -> There is still no supply that can claim any assets. Therefore,
    *    logically the supply in does not exist, and therefore cannot
    *    redeem anything.
        */
    if (assets.value != 0 && supply.value == 0) revert TokenizedVaultToolkit__PhantomSupply();

    /**
    * -> In this scenario there are no assets but there is supply
    *    to claim them.
    *
    * -> This can happen if all the assets have become worthless and
    *    this should be an impossible state. It may occuer if the vault
    *    has gone bankrupt, or the vault is not tracking assets
    *    properly.
    *
    * -> To protect any shareholders, this function will revert because
    *    the returned value would return zero otherwise. This would grant the
    *    vault an opportunity to resolve any issue or add more assets into
    *    the vault, so the supply would not be redeemed worthless.
        */
    if (assets.value == 0 && supply.value != 0) revert TokenizedVaultToolkit__SupplyWouldBeRedeemedWorthless();

    /**
    * -> As all possible edge cases have been handled, the operation
    *    can now compute the response normally.
        */
    return _divUsingFixedPointValueToolkit(_mulUsingFixedPointValueToolkit(supplyIn, assets, 18), supply, 18);
}

function _initialMintUsingTokenizedVaultToolkit(uint8 decimals) private pure returns (FixedPointValue memory) {
    return _getAsNewDecimalsUsingFixedPointValueToolkit(FixedPointValue({value: 1_000_000, decimals: 0}), decimals);
}