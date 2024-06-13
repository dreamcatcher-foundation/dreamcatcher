// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Token } from "./Token.sol";
import { TokenLib } from "./TokenLib.sol";
import { Transfer } from "./TokenLib.sol";
import { TokenLib__InsufficientBalance } from "./TokenLib.sol";

error TokenBurnLib__CannotBurnFromZeroAddress(address account, uint256 amount);

library TokenBurnLib {
    using TokenLib for Token;

    function burn(Token storage token, address account, uint256 amount) internal returns (bool) {
        if (account == address(0)) {
            revert TokenBurnLib__CannotBurnFromZeroAddress(account, amount);
        }
        if (token.balanceOf(account) < amount) {
            revert TokenLib__InsufficientBalance(account, amount);
        }
        token.inner.balances[account] -= amount;
        token.inner.totalSupply -= amount;
        emit Transfer(account, address(0), amount);
        return true;
    }
}