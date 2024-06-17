// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { FixedPointConversionLibrary } from "./FixedPointConversionLibrary.sol";
import { IERC20 } from "../../imports/openzeppelin/token/ERC20/IERC20.sol";

library FixedPointERC20AdaptorLibrary {
    function totalSupplyAsEtherDecimals(IERC20 token) internal view returns (FixedPointValue memory asEther) {
        return FixedPointConversionLibrary.convertToEtherDecimals(totalSupply(token));
    }

    function totalSupply(IERC20 token) internal view returns (FixedPointValue memory) {
        return FixedPointValue({ value: token.totalSupply(), decimals: token.decimals() });
    }

    function balanceOfAsEtherDecimals(IERC20 token, address account) internal view returns (FixedPointValue memory asEther) {
        return FixedPointConversionLibrary.convertToEtherDecimals(balanceOf(token, account));
    }

    function balanceOf(IERC20 token, address account) internal view returns (uint256) {
        return FixedPointValue({ value: token.balanceOf(account), decimals: token.decimals() });
    }

    function allowanceAsEtherDecimals(IERC20 token, address owner, address spender) internal view returns (FixedPointValue memory) {
        return FixedPointConversionLibrary.convertToEtherDecimals(allowance(owner, spender));
    }    

    function allowance(IERC20 token, address owner, address spender) internal view returns (FixedPointValue memory) {
        return FixedPointValue({ value: token.allowance(owner, spender), decimals: token.decimals() });
    }

    function transfer(IERC20 token, address to, FixedPointValue memory amount) internal returns (bool) {
        token.transfer(to, _toTokenDecimals(token, amount));
        return true;
    }

    function transferFrom(IERC20 token, address from, address to, FixedPointValue memory amount) internal returns (bool) {
        token.transferFrom(from, to, _toTokenDecimals(token, amount));
        return true;
    }

    function approve(IERC20 token, address spender, FixedPointValue memory amount) internal returns (bool) {
        token.approve(spender, _toTokenDecimals(token, amount));
        return true;
    }

    function _toTokenDecimals(IERC20 token, FixedPointValue memory number) private view returns (FixedPointValue memory) {
        return FixedPointConversionLibrary.convertToNewDecimals(number, token.decimals());
    }
}