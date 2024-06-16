// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

library TokenClass {
    using TokenClass for Token;

    event Approval(address indexed owner, address indexed spender, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);

    error InsufficientBalance(address account, uint256 amount);
    error InsufficientAllowance(address owner, address spender, uint256 amount);
    error ApprovalFromZeroAddress(address owner, address spender, uint256 amount);
    error ApprovalToZeroAddress(address owner, address spender, uint256 amount);
    error TransferFromZeroAddress(address from, address to, uint256 amount);
    error TransferToZeroAddress(address from, address to, uint256 amount);
    error AllowanceBelowZero(address spender, uint256 currentAllowance, uint256 decreasedAmount);

    struct Token {
        State state;
    }

    struct State {
        string symbol;
        uint256 totalSupply;
        mapping(address => uint256) balances;
        mapping(address => mapping(address => uint256)) allowances;
    }

    function totalSupply(Token storage self) internal view returns (uint256) {
        return self.state.totalSupply;
    }

    function balanceOf(Token storage self, address account) internal view returns (uint256) {
        return self.state.balances[account];
    }

    function allowance(Token storage self, address owner, address spender) internal view returns (uint256) {
        return self.state.allowances[owner][spender];
    }

    function transfer(Token storage self, address to, uint256 amount) internal returns (bool) {
        _transfer(self, msg.sender, to, amount);
        return true;
    }

    function transferFrom(Token storage self, address from, address to, uint256 amount) internal returns (bool) {
        _spendAllowance(self, from, msg.sender, amount);
        _transfer(self, from, to, amount);
        return true;
    }

    function approve(Token storage self, address spender, uint256 amount) internal returns (bool) {
        _approve(self, msg.sender, spender, amount);
        return true;
    }

    function increaseAllowance(Token storage self, address spender, uint256 amount) internal returns (bool) {
        _approve(self, msg.sender, spender, amount);
        return true;
    }

    function decreaseAllowance(Token storage self, address spender, uint256 amount) internal returns (bool) {
        if (self.allowance(msg.sender, spender) < amount) {
            revert AllowanceBelowZero(spender, self.allowance(msg.sender, spender), amount);
        }
        _approve(self, msg.sender, spender, self.allowance(msg.sender, spender) - amount);
        return true;
    }

    function _transfer(Token storage self, address from, address to, uint256 amount) private returns (bool) {
        if (from == address(0)) {
            revert TransferFromZeroAddress(from, to, amount);
        }
        if (to == address(0)) {
            revert TransferToZeroAddress(from, to, amount);
        }
        if (self.balanceOf(from) < amount) {
            revert InsufficientBalance(from, amount);
        }
        unchecked {
            self.state.balances[from] -= amount;
            self.state.balances[to] += amount;
        }
        emit Transfer(from, to, amount);
        return true;
    }    

    function _approve(Token storage self, address owner, address spender, uint256 amount) private returns (bool) {
        if (owner == address(0)) {
            revert ApprovalFromZeroAddress(owner, spender, amount);
        }
        if (spender == address(0)) {
            revert ApprovalToZeroAddress(owner, spender, amount);
        }
        self.state.allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
        return true;
    }

    function _spendAllowance(Token storage self, address owner, address spender, uint256 amount) private returns (bool) {
        if (self.allowance(owner, spender) == type(uint256).max) {
            return true;
        }
        if (self.allowance(owner, spender) < amount) {
            revert InsufficientAllowance(owner, spender, amount);
        }
        _approve(self, owner, spender, self.allowance(owner, spender) - amount);
        return true;
    }
}