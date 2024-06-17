// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IERC20 } from "../../imports/openzeppelin/token/ERC20/IERC20.sol";
import { IERC20Metadata } from "../../imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { IToken } from "./FixedPointERC20AdaptorLibrary.sol";
import { FixedPointValue } from "./FixedPointValue.sol";
import { FixedPointConversionLibrary } from "./FixedPointConversionLibrary.sol";
import { FixedPointArithmeticLibrary } from "./FixedPointArithmeticLibrary.sol";
import { FixedPointComparisonLibrary } from "./FixedPointComparisonLibrary.sol";
import { FixedPointPercentageLibrary } from "./FixedPointPercentageLibrary.sol";
import { FixedPointERC20AdaptorLibrary } from "./FixedPointERC20AdaptorLibrary.sol";

library FixedPointLibrary {
    function yield(FixedPointValue memory actual, FixedPointValue memory optimal) internal pure returns (FixedPointValue memory percentageAsEther) {
        return FixedPointPercentageLibrary.yield(actual, optimal);
    }

    function zeroYield() internal pure returns (FixedPointValue memory percentageAsEther) {
        return FixedPointPercentageLibrary.zeroYield();
    }

    function fullYield() internal pure returns (FixedPointValue memory percentageAsEther) {
        return FixedPointPercentageLibrary.fullYield();
    }

    function slice(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory percentageAsEther) {
        return FixedPointPercentageLibrary.slice(number0, number1);
    }

    function scale(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory percentageAsEther) {
        return FixedPointPercentageLibrary.scale(number0, number1);
    }

    function isLessThan(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        return FixedPointComparisonLibrary.isLessThan(number0, number1);
    }

    function isMoreThan(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        return FixedPointComparisonLibrary.isMoreThan(number0, number1);
    }

    function isEqualTo(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        return FixedPointComparisonLibrary.isEqualTo(number0, number1);
    }

    function isLessThanOrEqualTo(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        return FixedPointComparisonLibrary.isLessThanOrEqualTo(number0, number1);
    }

    function isMoreThanOrEqualTo(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
        return FixedPointComparisonLibrary.isMoreThanOrEqualTo(number0, number1);
    }

    function add(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory asEther) {
        return FixedPointArithmeticLibrary.add(number0, number1);
    }

    function sub(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory asEther) {
        return FixedPointArithmeticLibrary.sub(number0, number1);
    }

    function mul(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory asEther) {
        return FixedPointArithmeticLibrary.mul(number0, number1);
    }

    function div(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (FixedPointValue memory asEther) {
        return FixedPointArithmeticLibrary.div(number0, number1);
    }

    function convertToEtherDecimals(FixedPointValue memory number) internal pure returns (FixedPointValue memory asEther) {
        return FixedPointConversionLibrary.convertToEtherDecimals(number);
    }

    function convertToNewDecimals(FixedPointValue memory number, uint8 decimals) internal pure returns (FixedPointValue memory) {
        return FixedPointConversionLibrary.convertToNewDecimals(number, decimals);
    }

    function totalSupplyAsEtherDecimals(IToken token) internal view returns (FixedPointValue memory asEther) {
        return FixedPointERC20AdaptorLibrary.totalSupplyAsEtherDecimals(token);
    }

    function totalSupply(IToken token) internal view returns (FixedPointValue memory) {
        return FixedPointERC20AdaptorLibrary.totalSupply(token);
    }

    function balanceOfAsEtherDecimals(IToken token, address account) internal view returns (FixedPointValue memory asEther) {
        return FixedPointERC20AdaptorLibrary.balanceOfAsEtherDecimals(token, account);
    }

    function balanceOf(IToken token, address account) internal view returns (FixedPointValue memory) {
        return FixedPointERC20AdaptorLibrary.balanceOf(token, account);
    }

    function allowanceAsEtherDecimals(IToken token, address owner, address spender) internal view returns (FixedPointValue memory) {
        return FixedPointERC20AdaptorLibrary.allowanceAsEtherDecimals(token, owner, spender);
    }    

    function allowance(IToken token, address owner, address spender) internal view returns (FixedPointValue memory) {
        return FixedPointERC20AdaptorLibrary.allowance(token, owner, spender);
    }

    function transfer(IToken token, address to, FixedPointValue memory amount) internal returns (bool) {
        return FixedPointERC20AdaptorLibrary.transfer(token, to, amount);
    }

    function transferFrom(IToken token, address from, address to, FixedPointValue memory amount) internal returns (bool) {
        return FixedPointERC20AdaptorLibrary.transferFrom(token, from, to, amount);
    }

    function approve(IToken token, address spender, FixedPointValue memory amount) internal returns (bool) {
        return FixedPointERC20AdaptorLibrary.approve(token, spender, amount);
    }
}