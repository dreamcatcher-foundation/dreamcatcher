// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IERC20 } from "../../imports/openzeppelin/token/ERC20/IERC20.sol";
import { IERC20Metadata } from "../../imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { FixedPointMath } from "../math/FixedPointMath.sol";
import { FixedPointValue } from "../math/FixedPointValue.sol";

library Vendor {
    using FixedPointMath for FixedPointValue;

    function pullTokens(address token, address account, FixedPointValue memory amount) internal returns (bool) {
        IERC20(token).transferFrom(account, address(this), amount.toNewDecimals(decimals).value);
        return true;
    }

    function sendTokens(address token, address account, FixedPointValue memory amount) internal returns (bool) {
        IERC20(token).transfer(account, amount.toNewDecimals(IERC20Metadata(token).decimals()).value);
        return true;
    }

    /** -> Sends a portion of the contract's balance of a token to an account. */
    function sendTokensSlice(address token, address account, FixedPointValue memory sliceBasisPoint) internal returns (bool) {
        FixedPointValue memory amount 
            = FixedPointValue({ value: IERC20(token).balanceOf(address(this)), decimals: IERC20Metadata(token).decimals() })
                .toEther()
                .slice(sliceBasisPoint, 18)
                .toNewDecimals(IERC20Metadata(token).decimals());
        sendTokens(token, account, amount);
        return true;
    }
}