// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

library TokenLib {
    event Approval(address indexed owner, address indexed spender, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);

    error InsufficientBalance(address account, uint256 amount);
    error InsufficientAllowance(address owner, address spender, uint256 amount);
    error CannotApproveFromZeroAddress(address owner, address spender, uint256 amount);
    error CannotApproveToZeroAddress(address owner, address spender, uint256 amount);
    error CannotTransferFromZeroAddress(address from, address to, uint256 amount);
    error CannotTransferToZeroAddress(address from, address to, uint256 amount);
    error CannotDecreaseAllowanceBelowZero(address spender, uint256 currentAllowance, uint256 decreasedAmount);

    function totalSupply(Token storage token) internal view returns (uint256) {
        return token.totalSupply;
    }

    function balanceOf(Token storage token, address account) internal view returns (uint256) {
        return token.balances[account];
    }

    function allowance(Token storage token, address owner, address spender) internal view returns (uint256) {
        return token.allowances[owner][spender];
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