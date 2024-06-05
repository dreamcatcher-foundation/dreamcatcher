// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { TokenSlot } from "./TokenSlot.sol";
import { TokenSdk } from "./TokenSocket.sol";

contract TokenBurnSdk is 
    TokenSlot, 
    TokenSdk {
    error CannotBurnFromZeroAddress(address account, uint256 amount);

    function _burn(address account, uint256 amount) internal returns (bool) {
        if (account == address(0)) {
            revert CannotBurnFromZeroAddress(account, amount);
        }
        if (_balanceOf(account) < amount) {
            revert InsufficientBalance(account, amount);
        }
        _token().balances[account] -= amount;
        _token().totalSupply -= amount;
        emit Transfer(account, address(0), amount);
        return true;
    }
}