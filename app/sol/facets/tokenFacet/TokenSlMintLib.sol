// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { TokenSl } from "./TokenSl.sol";

library TokenSlMintLib {
    event Transfer(address indexed from, address indexed to, uint256 amount);

    error MintToAddressZero(address account, uint256 amount);

    function mint(TokenSl storage sl, address account, uint256 amount) internal returns (bool) {
        if (account == address(0)) {
            revert MintToAddressZero(account, amount);
        }
        sl._totalSupply += amount;
        sl._balances[account] += amount;
        emit Transfer(address(0), account, amount);
        return true;
    }
}