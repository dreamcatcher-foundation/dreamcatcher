// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "./TokenStorageSlot.sol";
import "./TokenSocket.sol";

contract TokenMintSocket is TokenStorageSlot, TokenSocket {
    error CannotMintToAddressZero(address account, uint256 amount);

    function _mint(address account, uint256 amount) internal returns (bool) {
        if (account == address(0)) {
            revert CannotMintToAddressZero(account, amount);
        }
        _tokenStorageSlot().totalSupply += amount;
        _tokenStorageSlot().balances[account] += amount;
        emit Transfer(address(0), account, amount);
        return true;
    }
}