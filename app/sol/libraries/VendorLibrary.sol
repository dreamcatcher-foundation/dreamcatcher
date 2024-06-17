// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IERC20 } from "../imports/openzeppelin/token/ERC20/IERC20.sol";
import { FixedPointValue } from "./fixedPoint/FixedPointValue.sol";
import { FixedPointLibrary } from "./fixedPoint/FixedPointLibrary.sol";

library VendorLibrary {
    function pullToken(IERC20 token, address account, FixedPointValue memory amount) internal returns (bool) {
        return FixedPointLibrary.transferFrom(token, account, address(this), amount);
    }

    function sendToken(IERC20 token, address account, FixedPointValue memory amount) internal returns (bool) {
        return FixedPointLibrary.transfer(token, account, amount);
    }

    function sendPercentageOfTokenBalance(IERC20 token, address account, FixedPointValue memory percentage) internal returns (bool) {
        percentage = FixedPointLibrary.convertToEtherDecimals(percentage);
        FixedPointValue memory balance = FixedPointLibrary.balanceOfAsEtherDecimals(token, address(this));
        FixedPointValue memory amountToSend = FixedPointLibrary.slice(balance, percentage);
        sendToken(token, account, amountToSend);
        return true;
    }
}