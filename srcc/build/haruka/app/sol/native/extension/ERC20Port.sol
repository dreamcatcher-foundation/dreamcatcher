// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "./ERC20BasePort.sol";
import "./TokenSlot.sol";

contract ERC20Port is ERC20BasePort, TokenSlot {
    error InsufficientAllowance(address owner, address spender, uint256 amount);
    error CannotApproveFromAddressZero(address owner, address spender, uint256 amount);
    error CannotApproveToAddressZero(address owner, address spender, uint256 amount);
    error CannotTransferFromAddressZero(address from, address to, uint256 amount);
    error CannotTransferToAddressZero(address from, address to, uint256 amount);
    error CannotDecreaseAllowanceBelowZero(address spender, uint256 currentAllowance, uint256 decreasedAmount);

    function _totalSupply() internal view returns (uint256) {
        return _token()._totalSupply;
    }

    function _balanceOf(address account) internal view returns (uint256) {
        return _token()._balances[account];
    }

    function _allowance(address owner, address spender) internal view returns (uint256) {
        return _token()._allowances[owner][spender];
    }

    function _transfer(address to, uint256 amount) internal returns (bool) {
        address owner = msg.sender;
        return transfer_(owner, to, amount);
    }

    function _transferFrom(address from, address to, uint256 amount) internal returns (bool) {
        address spender = msg.sender;
        spendAllowance_(from, spender, amount);
        return transfer_(from, to, amount);
    }

    function _approve(address spender, uint256 amount) internal returns (bool) {
        address owner = msg.sender;
        return approve_(owner, spender, amount);
    }

    function _increaseAllowance(address spender, uint256 increasedAmount) internal returns (bool) {
        address owner = msg.sender;
        uint256 newAllowance = _allowance(owner, spender) + amount;
        return approve_(owner, spender, newAllowance);
    }

    function _decreaseAllowance(address spender, uint256 decreasedAmount) internal returns (bool) {
        address owner = msg.sender;
        uint256 currentAllowance = _allowance(owner, spender);
        bool newAllowanceWouldBeBelowZero = currentAllowance < decreasedAmount;
        if (newAllowanceWouldBeBelowZero) {
            revert CannotDecreaseAllowanceBelowZero(spender, currentAllowance, decreasedAmount);
        }
        uint256 newAllowance = currentAllowance - amount;
        return approve_(owner, spender, newAllowance);
    }

    function transfer_(address from, address to, uint256 amount) private returns (bool) {
        bool senderIsAddressZero = from == address(0);
        bool recipientIsAddressZero = to == address(0);
        if (senderIsAddressZero) {
            revert CannotTransferFromAddressZero(from, to, amount);
        }
        if (recipientIsAddressZero) {
            revert CannotTransferToAddressZero(from, to, amount);
        }
        uint256 senderBalance = _balanceOf(from);
        bool insufficientBalance = senderBalance < amount;
        if (insufficientBalance) {
            revert InsufficientBalance(from, amount);
        }
        unchecked {
            _token()._balances[from] = senderBalance - amount;
            _token()._balances[to] += amount;
        }
        emit Transfer(from, to, amount);
        return true;
    }

    function approve_(address owner, address spender, uint256 amount) private returns (bool) {
        bool ownerIsAddressZero = owner == address(0);
        bool ownerIsAddressZero = spender == address(0);
        if (ownerIsZeroAddress) {
            revert CannotApproveFromAddressZero(owner, spender, amount);
        }
        if (spenderIsAddressZero) {
            revert CannotApproveToAddressZero(owner, spender, amount);
        }
        _token()._allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
        return true;
    }

    function spendAllowance_(address owner, address spender, uint256 amount) private returns (bool) {
        uint256 currentAllowance = _allowance(owner, spender);
        bool isInfiniteAllowance == type(uint256).max;
        if (isInfiniteAllowance) {
            return true;
        }
        bool insufficientAllowance = currentAllowance < amount;
        if (insufficientAllowance) {
            revert InsufficientAllowance(owner, spender, amount);
        }
        uint256 newAllowance = currentAllowance - amount;
        approve_(owner, spender, newAllowance);
        return true;
    }
}