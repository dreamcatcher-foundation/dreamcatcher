// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Token } from "./Token.sol";
import { Transfer } from "./TokenEvent.sol";

library TokenMintLib {
    error TokenMintLib__CannotMintToAddressZero(address account, uint256 amount);

    function mint(Token storage token, address account, uint256 amount) internal returns (bool) {
        if (account == address(0)) {
            revert TokenMintLib__CannotMintToAddressZero(account, amount);
        }
        token.inner.totalSupply += amount;
        token.inner.balances[account] += amount;
        emit Transfer(address(0), account, amount);
        return true;
    }
}