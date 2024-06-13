// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

library TokenStLib {
    event Approval(address indexed owner, address indexed spender, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);
    event NameChange();
    event SymbolChange();
    error InsufficientBalance(address account, uint256 amount);
    error InsufficientAllowance(address owner, address spender, uint256 amount);
    error CannotApproveFromZeroAddress(address owner, address spender, uint256 amount);
    error CannotApproveToZeroAddress(address owner, address spender, uint256 amount);
    error CannotTransferFromZeroAddress(address from, address to, uint256 amount);
    error CannotTransferToZeroAddress(address from, address to, uint256 amount);
    error CannotDecreaseAllowanceBelowZero(address spender, uint256 currentAllowance, uint256 decreasedAmount);
    error CannotBurnFromZeroAddress(address account, uint256 amount);
    error CannotMintToAddressZero(address account, uint256 amount);

    function totalSupply(Token storage token) internal view returns (uint256) {
        return token.totalSupply;
    }

    function balanceOf(Token storage token, address account) internal view returns (uint256) {
        return token.balances[account];
    }

    function allowance(Token storage token, address owner, address spender) internal view returns (uint256) {
        return token.allowances[owner][spender];
    }

    function setName(Token storage token, string memory name) internal returns (bool) {
        string memory oldName = token.name;
        string memory newName = token.name = name;
        emit NameChange(oldName, newName);
        return true;
    }

    function mint(Token storage token, address account, uint256 amount) internal returns (bool) {
        if (account == address(0)) {
            revert CannotMintToAddressZero(account, amount);
        }
        token.totalSupply += amount;
        token.balances[account] += amount;
        emit Transfer(address(0), account, amount);
        return true;
    }

    function burn(Token storage token, address account, uint256 amount) internal returns (bool) {
        if (account == address(0)) {
            revert CannotBurnFromZeroAddress(account, amount);
        }
        if (token.balanceOf(account) < amount) {
            revert InsufficientBalance(account, amount);
        }
        token.balances[account] -= amount;
        token.totalSupply -= amount;
        emit Transfer(account, address(0), amount);
        return true;
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
            revert CannotDecreaseAllowanceBelowZero(spender, allowance(token, msg.sender, spender), amount);
        }
        _approve(token, msg.sender, spender, allowance(token, msg.sender, spender) - amount);
        return true;
    }

    function _transfer(Token storage token, address from, address to, uint256 amount) private returns (bool) {
        if (from == address(0)) {
            revert CannotTransferFromZeroAddress(from, to, amount);
        }
        if (to == address(0)) {
            revert CannotTransferToZeroAddress(from, to, amount);
        }
        if (balanceOf(token, from) < amount) {
            revert InsufficientBalance(from, amount);
        }
        unchecked {
            token.balances[from] -= amount;
            token.balances[to] += amount;
        }
        emit Transfer(from, to, amount);
        return true;
    }

    function _approve(Token storage token, address owner, address spender, uint256 amount) private returns (bool) {
        if (owner == address(0)) {
            revert CannotApproveFromZeroAddress(owner, spender, amount);
        }
        if (spender == address(0)) {
            revert CannotApproveToZeroAddress(owner, spender, amount);
        }
        token.allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
        return true;
    }

    function _spendAllowance(Token storage token, address owner, address spender, uint256 amount) private returns (bool) {
        if (allowance(token, owner, spender) == type(uint256).max) {
            return true;
        }
        if (allowance(token, owner, spender) < amount) {
            revert InsufficientAllowance(owner, spender, amount);
        }
        _approve(token, spender, allowance(token, owner, spender) - amount);
        return true;
    }
}