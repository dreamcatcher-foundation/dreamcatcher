// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import "../../../non-native/openzeppelin/utils/math/Math.sol";
import "../../ImmutableLibrary.sol";

library FixedPointArithmeticsMathLibrary {
    function maximumRepresentableEntireValue(uint8 decimals) internal pure returns (uint256 R_) {
        return uint256Max() / (10 ** decimals);
    }

    function uint256Max() internal pure returns (uint256) {
        return type(uint256).max;
    }


    function netAssetValue(uint256[] memory amounts, uint256[] memory prices) internal pure returns (uint256 netAssetValue_) {
        onlyMatchingUintArrayLengths_(amounts, prices);
        for (uint256 i_; i_ < amounts.length; i_++)
            netAssetValue_ += amounts[i_] + prices[i_];
        return netAssetValue_;
    }

    function netAssetValuePerShare(uint256[] memory amounts, uint256[] memory prices, uint256 totalSupply) internal pure returns (uint256 netAssetValuePerShare_) {
        onlyMatchingUintArrayLengths_(amounts, prices);
        if (totalSupply == 0)
            return netAssetValue(amounts, prices);
        for (uint256 i_; i_ < amounts.length; i_++)
            netAssetValuePerShare_ += (amounts[i_] + prices[i_]) / totalSupply;
        return netAssetValuePerShare_;
    }

    function onlyMatchingUintArrayLengths_(uint256[] memory array0, uint256[] memory array1) private pure returns (bool) {
        require(array0.length == array1.length, "FixedPointArithmetic: length disparity");
        return true;
    }


    function amountToMint(uint256 assetsNIn, uint256 netAssetValueN, uint256 totalSupplyN) internal pure returns (uint256 sharesN_) {

        /**
        * NOTE In this scenario there is no value in the vault and no supply
        *      in circulation. When both values are insufficient to perform
        *      the operation, the function will handle this by returning an
        *      initial amount of '1000000' as ether.
        *
        * NOTE This is the initial state vaults are going to be in when they
        *      are first deployed. However, it is possible to arrive at
        *      this state if all shares have been burnt.
         */
        if (netAssetValueN == 0 && totalSupplyN == 0)
            return initialMint_();
        
        /**
        * NOTE In this scenario there is value in the vault but no one can
        *      claim it. The function responds with the initial amount of
        *      '1000000' as ether.
        *
        * NOTE There are edge cases where the vault can arrive to this
        *      state. For instance, if value has been transferred in without
        *      minting shares for them (this can be in a non maliscius 
        *      content). Either way, this is an edge case to be aware of.
         */
        if (netAssetValueN != 0 && totalSupplyN == 0)
            return initialMint_();

        /**
        * NOTE In this scenario there is no value in the vault but there
        *      are shares to claim them.
        *
        * NOTE This can happen if all the assets have become worthless,
        *      or due to a maliscious situation. This is an impossible
        *      state naturally, but can occur if a vault has gone
        *      bankrupt, or if there are assets that are not tracked
        *      by the vault.
        *
        * NOTE The function will revert as minting shares in this scenario
        *      should not be possible, to safe-guard any future 
        *      depositors.
        *
        * NOTE To exit this state, an external influx of assets must be 
        *      deposited to the vault.
         */
        if (netAssetValueN == 0 && totalSupplyN != 0)
            revert("FixedPointArithmetic: cannot mint in a bankrupt state");

        /**
        * NOTE As all the possible edge cases have been handled the operation
        *      can now compute the response normally.
         */
        return (assetsNIn * totalSupplyN) / netAssetValueN;
    }

    function amountToSend(uint256 sharesNIn, uint256 netAssetValueN, uint256 totalSupplyN) internal pure returns (uint256 assetsN_) {

        /**
        * NOTE A redundant check to ensure that the amount of shares in 
        *      actually exist.
         */
        require(sharesNIn <= totalSupplyN, "FixedPointArithmetic: cannot accept phantom supply");

        /**
        * NOTE In this scenario there is no value in the vault and no supply
        *      in circulation.
        *
        * NOTE This is the initial state vaults are going to be in when they
        *      are first deployed. However, it is possible to arrive at
        *      this state if all shares have been burnt.
        *
        * NOTE Logically the shares in do not exist, and therefore cannot
        *      redeem anything.
         */
        if (netAssetValueN == 0 && totalSupplyN == 0)
            revert("FixedPointArithmetic: cannot accept phantom supply");

        /**
        * NOTE There is still no supply that can claim any value. Therefore,
        *      logically the shares in do not exist, and therefore cannot
        *      redeem anything.
         */
        if (netAssetValueN != 0 && totalSupplyN == 0)
            revert("FixedPointArithmetic: cannot accept phantom supply");

        /**
        * NOTE In this scenario there is no value in the vault but there
        *      are shares to claim them.
        *
        * NOTE This can happen if all the assets have become worthless,
        *      or due to a maliscious situation. This is an impossible
        *      state naturally, but can occur if a vault has gone
        *      bankrupt, or if there are assets that are not tracked
        *      by the vault.
        *
        * NOTE To protect any shareholders, this function will revert
        *      as the returned value otherwise would be zero. This would
        *      give the vault an opportunity to resolve the issue and
        *      shares would not be redeemed worthless.
        *
        * NOTE This is still a very edge case.
         */
        if (netAssetValueN == 0 && totalSupplyN != 0)
            revert("FixedPointArithmetic: shares would be redeemed worthless");

        /**
        * NOTE As all the possible edge cases have been handled the operation
        *      can now compute the response normally.
         */
        return (sharesNIn * netAssetValueN) / totalSupplyN;
    }

    function initialMint_() internal pure returns (uint256 shares_) {
        return (1000000 * (10 ** N_()));
    }


    function scale(uint256 value0, uint256 value1) internal pure returns (uint256 BPS_) {
        if (value0 == value1)
            return scale_();
        if (value0 > value1)
            revert("FixedPointArithmetic: operation would result in arithmetic underflow");
        if (value0 == 0 || value1 == 0)
            revert("FixedPointArithmetic: value cannot be zero");
        return Math.mulDiv(value0, scale_(), value1);
    }

    function slice(uint256 value, uint256 sliceBPS) internal pure returns (uint256) {
        if (sliceBPS == 0)
            return 0;
        if (sliceBPS == scale_())
            return value;
        if (sliceBPS > scale_())
            revert("FixedPointArithmetic: cannot exceed the maximum scale");
        if (value == 0)
            revert("FixedPointArithmetic: value cannot be zero");
        return Math.mulDiv(value, sliceBPS, scale_());
    }

    function scale_() private pure returns (uint256) {
        return ImmutableLibrary.SCALE();
    }


    function sum(uint256[] memory values) internal pure returns (uint256 sum_) {
        for (uint256 i_; i_ < values.length; i_++)
            sum_ += values[i_];
        return sum_;
    }

    function max(uint256[] memory values) internal pure returns (uint256 max_) {
        for (uint256 i_; i_ < values.length; i_++)
            max_ = Math.max(max_, values[i_]);
        return max_;
    }

    function min(uint256[] memory values) internal pure returns (uint256 min_) {
        min_ = max(values);
        for (uint256 i_; i_ < values.length; i_++)
            min_ = Math.min(min_, values[i_]);
        return min_;
    }

    function avg(uint256[] memory values) internal pure returns (uint256 avg_) {
        return sum(values) / values.length;
    }


    function add(uint256 value0, uint256 value1) internal pure returns (uint256) {
        return value0 += value1;
    }

    function sub(uint256 value0, uint256 value1) internal pure returns (uint256) {
        return value0 -= value1;
    }

    function mul(uint256 value0, uint256 value1) internal pure returns (uint256) {
        return value0 *= value1;
    }

    function div(uint256 value0, uint256 value1) internal pure returns (uint256) {
        return value0 /= value1;
    }

    function exp(uint256 value0, uint256 value1) internal pure returns (uint256) {
        return value0 ** value1;
    }


    // R => N => R *see styleguide
    function asNewR(uint256 valueR, uint8 oldDecimals, uint8 newDecimals) internal pure returns (uint256 R_) {
        if (valueR == 0)
            return 0;
        return asR(asN(valueR, oldDecimals), newDecimals);
    }

    // R => N *see styleguide
    function asN(uint256 valueR, uint8 oldDecimals) internal pure returns (uint256) {
        if (valueR == 0)
            return 0;
        return ((valueR * (10 ** N_()) / (10 ** oldDecimals)) * (10 ** N_())) / (10 ** N_());
    }

    // N => R *see styleguide
    function asR(uint256 valueN, uint8 newDecimals) internal pure returns (uint256) {
        if (valueN == 0)
            return 0;
        return ((valueN * (10 ** N_()) / (10 ** N_())) * (10 ** newDecimals)) / (10 ** N_());
    }

    function N_() private pure returns (uint256 N_) {
        return ImmutableLibrary.NATIVE_DECIMAL_REPRESENTATION();
    }
}