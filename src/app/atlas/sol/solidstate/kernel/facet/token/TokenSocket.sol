// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "./TokenStorageSlot.sol";

contract TokenSocket is TokenStorageSlot {
    event Approval(address indexed owner, address indexed spender, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);

    error InsufficientBalance(address account, uint256 amount);
    error InsufficientAllowanceOnERC20Port(address owner, address spender, uint256 amount);
    error CannotApproveFromZeroAddressOnERC20Port(address owner, address spender, uint256 amount);
    error CannotApproveToZeroAddressOnERC20Port(address owner, address spender, uint256 amount);
    error CannotTransferFromZeroAddressOnERC20Port(address from, address to, uint256 amount);
    error CannotTransferToZeroAddressOnERC20Port(address from, address to, uint256 amount);
    error CannotDecreaseAllowanceBelowZeroOnERC20Port(address spender, uint256 currentAllowance, uint256 decreasedAmount);

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
        __spendAllowance(from, spender, amount);
        return __transfer(from, to, amount);
    }

    function _approve(address spender, uint256 amount) internal returns (bool) {
        return __aprove(owner, spender, amount);
    }

    function _increaseAllowance(address spender, uint256 amount) internal returns (bool) {
        return __approve(owner, spender, _allowance(owner, spender) + amount);
    }

    function _decreaseAllowance(address spender, uint256 amount) internal returns (bool) {
        if (_allowance(owner, spender) < amount) {
            revert CannotDecreaseAllowanceBelowZero(spender, _allowance(owner, spender), amount);
        }
        return __approve(owner, spender, _allowance(owner, spender) - amount);
    }

    function __transfer(address from, address to, uint256 amount) private returns (bool) {
        if (from == address(0)) {
            revert CannotTransferFromAddressZero(from, to, amount);
        }
        if (to == address(0)) {
            revert CannotTransferToAddressZero(from, to, amount);
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
            revert CannotApproveFromAddressZero(owner, spender, amount);
        }
        if (spender == address(0)) {
            revert CannotApproveToAddressZero(owner, spender, amount);
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