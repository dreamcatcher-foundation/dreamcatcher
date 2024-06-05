// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { TokenSlot } from "./TokenSlot.sol";
import { TokenSdk } from "./TokenSocket.sol";

contract TokenMintSdk is TokenSlot, TokenSdk {
    error CannotMintToAddressZero(address account, uint256 amount);

    function _mint(address account, uint256 amount) internal returns (bool) {
        if (account == address(0)) {
            revert CannotMintToAddressZero(account, amount);
        }
        _token().totalSupply += amount;
        _token().balances[account] += amount;
        emit Transfer(address(0), account, amount);
        return true;
    }
}