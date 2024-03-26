// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "./ERC20BasePort.sol";
import "./slot/TokenSlot.sol";

contract ERC20BurnablePort is ERC20BasePort, TokenSlot {
    error CannotBurnFromAddressZero(address account, uint256 amount);

    function _burn(address account, uint256 amount) internal returns (bool) {
        return burn_(account, amount);
    }
    
    function burn_(address account, uint256 amount) private returns (bool) {
        bool senderIsAddressZero = account == address(0);
        if (senderIsAddressZero) {
            revert CannotBurnFromAddressZero(account, amount);
        }
        uint256 senderBalance = _token()._balances[account];
        bool insufficientBalance = senderBalance < amount;
        if (insufficientBalance) {
            revert InsufficientBalance(account, amount);
        }
        _token()._balances[account] = senderBalance - amount;
        _token()._totalSupply -= amount;
        emit Transfer(account, address(0), amount);
        return true;
    }
}