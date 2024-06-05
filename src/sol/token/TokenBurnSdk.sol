// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { TokenSocket } from "./TokenSocket.sol";
import { TokenSdk } from "./TokenSdk.sol";

contract TokenBurnSdk is TokenSocket, TokenSdk {
    error CannotBurnFromZeroAddress(address account, uint256 amount);

    function _burn(address account, uint256 amount) internal returns (bool) {
        if (account == address(0)) {
            revert CannotBurnFromZeroAddress(account, amount);
        }
        if (_balanceOf(account) < amount) {
            revert InsufficientBalance(account, amount);
        }
        _tokenSocket().setBalanceOf(account, _balanceOf(account) - amount);
        _tokenSocket().setTotalSupply(_totalSupply() - amount);
        emit Transfer(account, address(0), amount);
        return true;
    }
}