// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "./ERC20BasePort.sol";
import "../slot/ERC20Slot.sol";

contract ERC20Port is ERC20Slot, ERC20BasePort {
    error InsufficientAllowanceOnERC20Port(address owner, address spender, uint256 amount);
    error CannotApproveFromZeroAddressOnERC20Port(address owner, address spender, uint256 amount);
    error CannotApproveToZeroAddressOnERC20Port(address owner, address spender, uint256 amount);
    error CannotTransferFromZeroAddressOnERC20Port(address from, address to, uint256 amount);
    error CannotTransferToZeroAddressOnERC20Port(address from, address to, uint256 amount);
    error CannotDecreaseAllowanceBelowZeroOnERC20Port(address spender, uint256 currentAllowance, uint256 decreasedAmount);

    function _totalSupplyOnERC20Port() internal view returns (uint256) {
        return _ERC20Slot().totalSupply;
    }

    function _balanceOfOnERC20Port(address account) internal view returns (uint256) {
        return _ERC20Slot().balances[account];
    }

    function _allowanceOnERC20Port(address owner, address spender) internal view returns (uint256) {
        return _ERC20Slot().allowances[owner][spender];
    }

    function _transferOnERC20Port(address to, uint256 amount) internal returns (bool) {
        address owner = msg.sender;
        return __transferOnERC20Port(owner, to, amount);
    }

    function _transferFromOnERC20Port(address from, address to, uint256 amount) internal returns (bool) {
        address spender = msg.sender;
        __spendAllowanceOnERC20Port(from, spender, amount);
        return __transferOnERC20Port(from, to, amount);
    }

    function _approveOnERC20Port(address spender, uint256 amount) internal returns (bool) {
        address owner = msg.sender;
        return __approveOnERC20Port(owner, spender, amount);
    }

    function _increaseAllowanceOnERC20Port(address spender, uint256 amount) internal returns (bool) {
        address owner = msg.sender;
        uint256 currentAllowance = _allowanceOnERC20Port(owner, spender);
        uint256 newAllowance = currentAllowance + amount;
        return __approveOnERC20Port(owner, spender, newAllowance);
    }

    function _decreaseAllowanceOnERC20Port(address spender, uint256 amount) internal returns (bool) {
        address owner = msg.sender;
        uint256 currentAllowance = _allowanceOnERC20Port(owner, spender);
        bool newAllowanceWouldBeBelowZero = currentAllowance < amount;
        if (newAllowanceWouldBeBelowZero) revert CannotDecreaseAllowanceBelowZero(spender, currentAllowance, decreasedAmount);
        uint256 newAllowance = currentAllowance - amount;
        return __approveOnERC20Port(owner, spender, newAllowance);
    }

    function __transferOnERC20Port(address from, address to, uint256 amount) private returns (bool) {
        bool senderIsZeroAddress = from == address(0);
        bool recipientIsZeroAddress = to == address(0);
        if (senderIsZeroAddress) revert CannotTransferFromAddressZero(from, to, amount);
        if (recipientIsZeroAddress) revert CannotTransferToAddressZero(from, to, amount);
        uint256 senderBalance = _balanceOfOnERC20Port(from);
        uint256 recipientBalance = _balanceOfOnERC20Port(to);
        bool senderHasSufficientBalance = senderBalance >= amount;
        if (!senderHasSufficientBalance) revert InsufficientBalance(from, amount);
        unchecked {
            uint256 newSenderBalance = senderBalance - amount;
            uint256 newRecipientBalance = recipientBalance + amount;
            _ERC20Slot().balances[from] = newSenderBalance;
            _ERC20Slot().balances[to] = newRecipientBalance;
        }
        emit TransferOnERC20BasePort(from, to, amount);
        return true;
    }

    function __approveOnERC20Port(address owner, address spender, uint256 amount) private returns (bool) {
        bool ownerIsZeroAddress = owner == address(0);
        bool spenderIsZeroAddress = spender == address(0);
        if (ownerIsZeroAddress) revert CannotApproveFromAddressZero(owner, spender, amount);
        if (spenderIsZeroAddress) revert CannotApproveToAddressZero(owner, spender, amount);
        _ERC20Slot().allowances[owner][spender] = amount;
        emit ApprovalOnERC20BasePort(owner, spender, amount);
        return true;
    }

    function __spendAllowanceOnERC20Port(address owner, address spender, uint256 amount) private returns (bool) {
        uint256 currentAllowance = _allowanceOnERC20Port(owner, spender);
        bool isInfiniteAllowance = currentAllowance == type(uint256).max;
        if (isInfiniteAllowance) return true;
        bool hasSufficientAllowance = currentAllowance >= amount;
        if (!hasSufficientAllowance) revert revert InsufficientAllowance(owner, spender, amount);
        uint256 newAllowance = currentAllowance - amount;
        __approveOnERC20Port(owner, spender, newAllowance);
        return true;
    }
}