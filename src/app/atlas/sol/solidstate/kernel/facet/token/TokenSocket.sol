// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "./TokenStorageSlot.sol";

contract TokenSocket is TokenStorageSlot {
    event Approval(address indexed owner, address indexed spender, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);

    error InsufficientBalance(address account, uint256 amount);
    error InsufficientAllowance(address owner, address spender, uint256 amount);
    error CannotApproveFromZeroAddress(address owner, address spender, uint256 amount);
    error CannotApproveToZeroAddress(address owner, address spender, uint256 amount);
    error CannotTransferFromZeroAddress(address from, address to, uint256 amount);
    error CannotTransferToZeroAddress(address from, address to, uint256 amount);
    error CannotDecreaseAllowanceBelowZero(address spender, uint256 currentAllowance, uint256 decreasedAmount);

    function _totalSupply() internal view returns (uint256) {
        return _tokenStorageSlot().totalSupply;
    }

    function _balanceOf(address account) internal view returns (uint256) {
        return _tokenStorageSlot().balances[account];
    }

    function _allowance(address owner, address spender) internal view returns (uint256) {
        return _tokenStorageSlot().allowances[owner][spender];
    }

    function _transfer(address to, uint256 amount) internal returns (bool) {
        return __transfer(msg.sender, to, amount);
    }

    function _transferFrom(address from, address to, uint256 amount) internal returns (bool) {
        __spendAllowance(from, msg.sender, amount);
        return __transfer(from, to, amount);
    }

    function _approve(address spender, uint256 amount) internal returns (bool) {
        return __approve(msg.sender, spender, amount);
    }

    function _increaseAllowance(address spender, uint256 amount) internal returns (bool) {
        return __approve(msg.sender, spender, _allowance(msg.sender, spender) + amount);
    }

    function _decreaseAllowance(address spender, uint256 amount) internal returns (bool) {
        if (_allowance(msg.sender, spender) < amount) {
            revert CannotDecreaseAllowanceBelowZero(spender, _allowance(msg.sender, spender), amount);
        }
        return __approve(msg.sender, spender, _allowance(msg.sender, spender) - amount);
    }

    function __transfer(address from, address to, uint256 amount) private returns (bool) {
        if (from == address(0)) {
            revert CannotTransferFromZeroAddress(from, to, amount);
        }
        if (to == address(0)) {
            revert CannotTransferToZeroAddress(from, to, amount);
        }
        if (_balanceOf(from) < amount) {
            revert InsufficientBalance(from, amount);
        }
        unchecked {
            _tokenStorageSlot().balances[from] = _balanceOf(from) - amount;
            _tokenStorageSlot().balances[to] = _balanceOf(to) + amount;
        }
        emit Transfer(from, to, amount);
        return true;
    }

    function __approve(address owner, address spender, uint256 amount) private returns (bool) {
        if (owner == address(0)) {
            revert CannotApproveFromZeroAddress(owner, spender, amount);
        }
        if (spender == address(0)) {
            revert CannotApproveToZeroAddress(owner, spender, amount);
        }
        _tokenStorageSlot().allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
        return true;
    }

    function __spendAllowance(address owner, address spender, uint256 amount) private returns (bool) {
        if (_allowance(owner, spender) == type(uint256).max) {
            return true;
        }
        if (_allowance(owner, spender) < amount) {
            revert InsufficientAllowance(owner, spender, amount);
        }
        __approve(owner, spender, _allowance(owner, spender) - amount);
        return true;
    }
}