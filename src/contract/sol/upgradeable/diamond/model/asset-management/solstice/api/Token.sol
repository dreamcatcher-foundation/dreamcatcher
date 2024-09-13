// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {Storage} from "./sl.sol";

contract Token is Storage {
    event Transfer(address from, address to, uint256 amount);

    function _mint(address account, uint256 amount) internal virtual {

        _sl().totalSupply += amount;
        unchecked {
            _sl().balances[account] += amount;
        }
        emit Transfer(address(0), account, amount);
        return;
    }

    function _burn(address account, uint256 amount) internal virtual {

        uint256 accountBalance = _sl().balances[account];

        unchecked {
            _sl().balances[account] = accountBalance - amount;
            _sl().totalSupply -= amount;
        }

        emit Transfer(account, address(0), amount);
        return;
    }
}