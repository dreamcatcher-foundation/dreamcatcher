// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { FixedPointValue } from "./FixedPointValue.sol";
import { FixedPointConversionLibrary } from "./FixedPointConversionLibrary.sol";
import { IERC20Metadata } from "../../imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { IERC20 } from "../../imports/openzeppelin/token/ERC20/IERC20.sol";

interface IToken is 
    IERC20,
    IERC20Metadata
    {}

library FixedPointERC20AdaptorLibrary {
    function totalSupplyAsEtherDecimals(IToken token) internal view returns (FixedPointValue memory asEther) {
        return FixedPointConversionLibrary.convertToEtherDecimals(totalSupply(token));
    }

    function totalSupply(IToken token) internal view returns (FixedPointValue memory) {
        return FixedPointValue({ value: token.totalSupply(), decimals: token.decimals() });
    }

    function balanceOfAsEtherDecimals(IToken token, address account) internal view returns (FixedPointValue memory asEther) {
        return FixedPointConversionLibrary.convertToEtherDecimals(balanceOf(token, account));
    }

    function balanceOf(IToken token, address account) internal view returns (FixedPointValue memory) {
        return FixedPointValue({ value: token.balanceOf(account), decimals: token.decimals() });
    }

    function allowanceAsEtherDecimals(IToken token, address owner, address spender) internal view returns (FixedPointValue memory) {
        return FixedPointConversionLibrary.convertToEtherDecimals(allowance(token, owner, spender));
    }    

    function allowance(IToken token, address owner, address spender) internal view returns (FixedPointValue memory) {
        return FixedPointValue({ value: token.allowance(owner, spender), decimals: token.decimals() });
    }

    function transfer(IToken token, address to, FixedPointValue memory amount) internal returns (bool) {
        token.transfer(to, _toTokenDecimals(token, amount).value);
        return true;
    }

    function transferFrom(IToken token, address from, address to, FixedPointValue memory amount) internal returns (bool) {
        token.transferFrom(from, to, _toTokenDecimals(token, amount).value);
        return true;
    }

    function approve(IToken token, address spender, FixedPointValue memory amount) internal returns (bool) {
        token.approve(spender, _toTokenDecimals(token, amount).value);
        return true;
    }

    function _toTokenDecimals(IToken token, FixedPointValue memory number) private view returns (FixedPointValue memory) {
        return FixedPointConversionLibrary.convertToNewDecimals(number, token.decimals());
    }
}