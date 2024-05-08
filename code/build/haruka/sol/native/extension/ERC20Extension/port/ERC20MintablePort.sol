// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "../slot/ERC20Slot.sol";
import "./ERC20BasePort.sol";

contract ERC20MintablePort is ERC20Slot, ERC20BasePort {
    error CannotMintToAddressZeroOnERC20MintablePort(address account, uint256 amount);

    function _mintOnERC20MintablePort(address account, uint256 amount) internal returns (bool) {
        return __mintOnERC20MintablePort(account, amount);
    }

    function __mintOnERC20MintablePort(address account, uint256 amount) private returns (bool) {
        bool recipientIsZeroAddress = account == address(0);
        if (recipientIsZeroAddress) revert CannotMintToAddressZeroOnERC20MintablePort(account, amount);
        uint256 currentSupply = _ERC20Slot().totalSupply;
        uint256 currentBalance = _ERC20Slot().balances[account];
        _ERC20Slot().totalSupply = currentSupply + amount;
        _ERC20Slot().balances[account] = currentBalance + amount;
        emit TransferOnERC20BasePort(address(0), account, amount);
        return true;
    }
}