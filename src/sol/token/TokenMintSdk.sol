// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { TokenSocket } from "./TokenSocket.sol";
import { TokenSdk } from "./TokenSdk.sol";

contract TokenMintSdk is TokenSocket, TokenSdk {
    error CannotMintToAddressZero(address account, uint256 amount);

    function _mint(address account, uint256 amount) internal returns (bool) {
        if (account == address(0)) {
            revert CannotMintToAddressZero(account, amount);
        }
        _tokenSocket().setTotalSupply(_totalSupply() + amount);
        _tokenSocket().setBalanceOf(account, _balanceOf(account) + amount);
        emit Transfer(address(0), account, amount);
        return true;
    }
}