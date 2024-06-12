// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Token } from "./Token.sol";
import { Approval } from "./TokenEvent.sol";
import { Transfer } from "./TokenEvent.sol";

event Approval(address indexed owner, address indexed spender, uint256 amount);
event Transfer(address indexed from, address indexed to, uint256 amount);

error TokenLib__InsufficientBalance(address account, uint256 amount);
error TokenLib__InsufficientAllowance(address owner, address spender, uint256 amount);
error TokenLib__CannotApproveFromZeroAddress(address owner, address spender, uint256 amount);
error TokenLib__CannotApproveToZeroAddress(address owner, address spender, uint256 amount);
error TokenLib__CannotTransferFromZeroAddress(address from, address to, uint256 amount);
error TokenLib__CannotTransferToZeroAddress(address from, address to, uint256 amount);
error TokenLib__CannotDecreaseAllowanceBelowZero(address spender, uint256 currentAllowance, uint256 decreasedAmount);

library TokenLib {
    function totalSupply(Token storage token) internal view returns (uint256) {
        return token.inner.totalSupply;
    }

    function balanceOf(Token storage token, address account) internal view returns (uint256) {
        return token.inner.balances[account];
    }

    function allowance(Token storage token, address owner, address spender) internal view returns (uint256) {
        return token.inner.allowances[owner][spender];
    }

    function transfer(Token storage token, address to, uint256 amount) internal returns (bool) {
        _transfer(token, msg.sender, to, amount);
        return true;
    }

    function transferFrom(Token storage token, address from, address to, uint256 amount) internal returns (bool) {
        _spendAllowance(token, from, msg.sender, amount);
        _transfer(token, from, to, amount);
        return true;
    }

    function approve(Token storage token, address spender, uint256 amount) internal returns (bool) {
        return _approve(token, msg.sender, spender, amount);
    }

    function increaseAllowance(Token storage token, address spender, uint256 amount) internal returns (bool) {
        _approve(token, msg.sender, allowance(msg.sender, spender) + amount);
        return true;
    }

    function decreaseAllowance(Token storage token, address spender, uint256 amount) internal returns (bool) {
        if (allowance(token, msg.sender, spender) < amount) {
            revert TokenLib__CannotDecreaseAllowanceBelowZero(spender, allowance(token, msg.sender, spender), amount);
        }
        _approve(token, msg.sender, spender, allowance(token, msg.sender, spender) - amount);
        return true;
    }

    function _transfer(Token storage token, address from, address to, uint256 amount) private returns (bool) {
        if (from == address(0)) {
            revert TokenLib__CannotTransferFromZeroAddress(from, to, amount);
        }
        if (to == address(0)) {
            revert TokenLib__CannotTransferToZeroAddress(from, to, amount);
        }
        if (balanceOf(from) < amount) {
            revert TokenLib__InsufficientBalance(from, amount);
        }
        unchecked {
            token.inner.balances[from] -= amount;
            token.inner.balances[to] += amount;
        }
        emit Transfer(from, to, amount);
        return true;
    }

    function _approve(Token storage token, address owner, address spender, uint256 amount) private returns (bool) {
        if (owner == address(0)) {
            revert TokenLib__CannotApproveFromZeroAddress(owner, spender, amount);
        }
        if (spender == address(0)) {
            revert TokenLib__CannotApproveToZeroAddress(owner, spender, amount);
        }
        token.inner.allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
        return true;
    }

    function _spendAllowance(Token storage token, address owner, address spender, uint256 amount) private returns (bool) {
        if (allowance(token, owner, spender) == type(uint256).max) {
            return true;
        }
        if (allowance(token, owner, spender) < amount) {
            revert TokenLib__InsufficientAllowance(owner, spender, amount);
        }
        _approve(token, spender, allowance(token, owner, spender) - amount);
        return true;
    }
}