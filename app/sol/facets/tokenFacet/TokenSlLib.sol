// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { TokenSl } from "./TokenSl.sol";

library TokenSlLib {
    using TokenSlLib for TokenSl; 

    event Approval(address indexed owner, address indexed spender, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);

    error InsufficientBalance(address account, uint256 amount);
    error InsufficientAllowance(address owner, address spender, uint256 amount);
    error ApprovalFromZeroAddress(address owner, address spender, uint256 amount);
    error ApprovalToZeroAddress(address owner, address spender, uint256 amount);
    error TransferFromZeroAddress(address from, address to, uint256 amount);
    error TransferToZeroAddress(address from, address to, uint256 amount);
    error AllowanceBelowZero(address spender, uint256 allowance, uint256 amount);

    function name(TokenSl storage sl) internal view returns (string memory) {
        return sl._name;
    }

    function symbol(TokenSl storage sl) internal view returns (string memory) {
        return sl._symbol;
    }

    function totalSupply(TokenSl storage sl) internal view returns (uint256) {
        return sl._totalSupply;
    }

    function balanceOf(TokenSl storage sl, address account) internal view returns (uint256) {
        return sl._balances[account];
    }

    function allowance(TokenSl storage sl, address owner, address spender) internal view returns (uint256) {
        return sl._allowances[owner][spender];
    }

    function transfer(TokenSl storage sl, address to, uint256 amount) internal returns (bool) {
        _transfer(sl, msg.sender, to, amount);
        return true;
    }

    function transferFrom(TokenSl storage sl, address from, address to, uint256 amount) internal returns (bool) {
        _spendAllowance(sl, from, msg.sender, amount);
        _transfer(sl, from, to, amount);
        return true;
    }

    function approve(TokenSl storage sl, address spender, uint256 amount) internal returns (bool) {
        _approve(sl, msg.sender, spender, amount);
        return true;
    }

    function increaseAllowance(TokenSl storage sl, address spender, uint256 amount) internal returns (bool) {
        _approve(sl, msg.sender, spender, sl.allowance(msg.sender, spender) + amount);
        return true;
    }

    function decreaseAllowance(TokenSl storage sl, address spender, uint256 amount) internal returns (bool) {
        if (sl.allowance(msg.sender, spender) < amount) {
            revert AllowanceBelowZero(spender, sl.allowance(msg.sender, spender), amount);
        }
        _approve(sl, msg.sender, spender, sl.allowance(msg.sender, spender) - amount);
        return true;
    }

    function _transfer(TokenSl storage sl, address from, address to, uint256 amount) private returns (bool) {
        if (from == address(0)) {
            revert TransferFromZeroAddress(from, to, amount);
        }
        if (to == address(0)) {
            revert TransferToZeroAddress(from, to, amount);
        }
        if (sl.balanceOf(from) < amount) {
            revert InsufficientBalance(from, amount);
        }
        unchecked {
            sl._balances[from] -= amount;
            sl._balances[to] += amount;
        }
        emit Transfer(from, to, amount);
        return true;
    }

    function _approve(TokenSl storage sl, address owner, address spender, uint256 amount) private returns (bool) {
        if (owner == address(0)) {
            revert ApprovalFromZeroAddress(owner, spender, amount);
        }
        if (spender == address(0)) {
            revert ApprovalToZeroAddress(owner, spender, amount);
        }
        sl._allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
        return true;
    }

    function _spendAllowance(TokenSl storage sl, address owner, address spender, uint256 amount) private returns (bool) {
        if (sl.allowance(owner, spender) == type(uint256).max) {
            return true;
        }
        if (sl.allowance(owner, spender) < amount) {
            revert InsufficientAllowance(owner, spender, amount);
        }
        _approve(sl, owner, spender, sl.allowance(owner, spender) - amount);
        return true;
    }
}s