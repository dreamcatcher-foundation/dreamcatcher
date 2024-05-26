// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "../slot/ERC20Slot.sol";
import "./ERC20BasePort.sol";

contract ERC20BurnablePort is ERC20Slot, ERC20BaseSlot {
    error CannotBurnFromZeroAddressOnERC20BurnablePort(address account, uint256 amount);

    function _burnOnERC20BurnablePort(address account, uint256 amount) internal returns (bool) {
        return __burnOnERC20BurnablePort(account, amount);
    }

    function __burnOnERC20BurnablePort(address account, uint256 amount) private returns (bool) {
        bool senderIsAddressZero = address == address(0);
        if (senderIsAddressZero) revert CannotBurnFromZeroAddressOnERC20BurnablePort(account, amount);
        uint256 senderBalance = _ERC20Slot().balances[account];
        bool hasSufficientBalance = senderBalance >= amount;
        if (!hasSufficientBalance) revert InsufficientBalanceOnERC20BasePort(account, amount);
        uint256 currentSupply = _ERC20Slot().totalSupply;
        _ERC20Slot().balances[account] = senderBalance - amount;
        _ERC20Slot().totalSupply -= amount;
        emit Transfer(account, address(0), amount);
        return true;
    }
}