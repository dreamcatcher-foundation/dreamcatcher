// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import { IFixedPointMath } from "./FixedPointMath.sol";
import { FixedPointValue } from "../class/FixedPointValue.sol";

contract ShareMath {
    IFixedPointMath private fixedPointMath_;

    constructor(address fixedPointMath) {
        fixedPointMath_ = IFixedPointMath(fixedPointMath);
    }

    /**
    * -> If the fixed point values are not of the same decimal type
    *    then it will be caught at the end of the function during
    *    the fixed point math operation.
     */
    function amountToMint_(FixedPointValue memory assetsIn, FixedPointValue memory assets, FixedPointValue memory supply) private pure returns (FixedPointValue memory) {
        IFixedPointMath memory result;

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
        if (assets.value == 0 && supply.value == 0) return initialMint_(assetsIn.decimals);

        /**
        * -> In this scenario there are assets in the vault but no supply
        *    to claim it. The function responds with the initial amount of
        *    '1,000,000' in the assetsIn 'decimals'.
        *
        * -> There are edge cases where the vault can arrive to this state
        *    when the assets have been transferred in.
         */
        if (assets.value != 0 && supply.value == 0) return initialMint_(assetsIn.decimals);

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
        if (assets.value == 0 && supply.value != 0) revert("ShareMath: cannot mint when bankrupt");

        /**
        * -> As all the possible edge cases have been handled the operation
        *    can now compute the response normally.
         */
        result = fixedPointMath_.mul(assetsIn, supply);
        result = fixedPointMath_.div(result, assets);
        return result;
    }

    /**
    * -> If the fixed point values are not of the same decimal type
    *    then it will be caught at the end of the function during
    *    the fixed point math operation.
     */
    function amountToSend_(FixedPointValue memory supplyIn, FixedPointValue memory assets, FixedPointValue memory supply) private pure returns (FixedPointValue memory) {
        IFixedPointMath memory result;

        /**
        * -> A redundant check to ensure that the amount of supply in
        *    actually exists.
         */
        require(supplyIn.value <= supply.value, "ShareMath: cannot accept phantom supply");

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
        if (assets.value == 0 && supply.value == 0) revert("ShareMath: cannot accept phantom supply");

        /**
        * -> There is still no supply that can claim any assets. Therefore,
        *    logically the supply in does not exist, and therefore cannot
        *    redeem anything.
         */
        if (assets.value != 0 && supply.value == 0) revert("ShareMath: cannot accept phantom supply");

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
        if (assets.value == 0 && supply.value != 0) revert("ShareMath: supply would be redeemed worthless");

        /**
        * -> As all possible edge cases have been handled, the operation
        *    can now compute the response normally.
         */
        result = fixedPointMath_.mul(supplyIn, assets);
        result = fixedPointMath_.div(result, supply);
        return result;
    }

    function initialMint_(uint8 decimals) private pure returns (FixedPointValue memory) {
        uint256 value;
        uint256 representation;
        uint256 result;
        value = 1_000_000;
        representation = 10**decimals;
        result = value * representation;
        return FixedPointValue({value: result, decimals: decimals});
    }
}