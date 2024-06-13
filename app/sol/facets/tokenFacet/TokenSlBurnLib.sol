// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { TokenSl } from "./TokenSl.sol";
import { TokenSlLib } from "./TokenSlLib.sol";

library TokenSlBurnLib {
    using TokenSlLib for TokenSl;

    event Transfer(address indexed from, address indexed to, uint256 amount);

    error InsufficientBalance(address account, uint256 amount);
    error BurnFromZeroAddress(address account, uint256 amount);

    function burn(TokenSl storage sl, address account, uint256 amount) internal returns (bool) {
        if (account == address(0)) {
            revert BurnFromZeroAddress(account, amount);
        }
        if (sl.balanceOf(account) < amount) {
            revert InsufficientBalance(account, amount);
        }
        sl._balances[account] -= amount;
        sl._totalSupply -= amount;
        emit Transfer(account, address(0), amount);
        return true;
    }
}