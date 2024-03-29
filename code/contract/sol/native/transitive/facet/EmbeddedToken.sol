// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import '../sockets/TokenStateSocket.sol';

interface IEmbeddedToken {
    event Approval(address indexed owner, address indexed spender, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);
}

contract EmbeddedToken is IERC20Implementation, ERC20StateSocket {
    error ERC20Implementation__CannotTransferFromAddressZero();
    error ERC20Implementation__CannotTransferToAddressZero();
    error ERC20Implementation__InsufficientBalance();
    error ERC20Implementation__InsufficientAllowance();
    error ERC20Implementation__CannotMintToAddressZero();
    error ERC20Implementation__CannotBurnFromAddressZero();
    error ERC20Implementation__CannotApproveFromAddressZero();
    error ERC20Implementation__CannotApproveToAddressZero();
    error ERC20Implementation__CannotDecreaseAllowanceBelowZero();

    function _erc20Implementation__name() internal view virtual returns (string memory) {
        return _tokenStateSocket().name();
    }

    function _erc20Implementation__symbol() internal view virtual returns (string memory) {
        return _tokenStateSocket().symbol();
    }

    function _erc20Implementation__decimals() internal view virtual returns (uint8) {
        return _tokenStateSocket().decimals();
    }

    function _erc20Implementation__totalSupply() internal view virtual returns (uint256) {
        return _tokenStateSocket().totalSupply();
    }

    function _erc20Implementation__balanceOf(address account) internal view virtual returns (uint256) {
        return _tokenStateSocket().balances(account);
    }

    function _erc20Implementation__allowance(address owner, address spender) internal view virtual returns (uint256) {
        return _tokenStateSocket().allowances(owner, spender);
    }

    function _erc20Implementation__setName(string memory name) internal virtual returns (bool) {
        return _tokenStateSocket().setName(name);
    }

    function _erc20Implementation__setSymbol(string memory symbol) internal virtual returns (bool) {
        return _tokenStateSocket().setSymbol(symbol);
    }

    function _erc20Implementation__transfer(address to, uint256 amount) internal virtual returns (bool) {
        address owner = msg.sender;
        return erc20Implementation__transfer_(owner, to, amount);
    }

    function _erc20Implementation__transferFrom(address from, address to, uint256 amount) internal virtual returns (bool) {
        address spender = msg.sender;
        erc20Implementation__spendAllowance_(from, spender, amount);
        return erc20Implementation__transfer_(from, to, amount);
    }

    function _erc20Implementation__mint(address account, uint256 amount) internal virtual returns (bool) {
        return erc20Implementation__mint_(account, amount);
    }

    function _erc20Implementation__burn(address account, uint256 amount) internal virtual returns (bool) {
        return erc20Implementation__burn_(account, amount);
    }

    function _erc20Implementation__approve(address spender, uint256 amount) internal virtual returns (bool) {
        address owner = msg.sender;
        erc20Implementation__approve_(owner, spender, amount);
        return true;
    }

    function _erc20Implementation__increaseAllowance(address spender, uint256 amount) internal virtual returns (bool) {
        address owner = msg.sender;
        uint256 currentAllowance = _erc20Implementation__allowance(owner, spender);
        uint256 newAllowance = currentAllowance + amount;
        erc20Implementation__approve_(owner, spender, newAllowance);
        return true;
    }

    function _erc20Implementation__decreaseAllowance(address spender, uint256 amount) internal virtual returns (bool) {
        address owner = msg.sender;
        uint256 currentAllowance = _erc20Implementation__allowance(owner, spender);
        if (currentAllowance < amount) revert ERC20Implementation__CannotDecreaseAllowanceBelowZero();
        unchecked {
            uint256 newAllowance = currentAllowance - amount;
            erc20Implementation__approve_(owner, spender, newAllowance);
        }
        return true;
    }

    function erc20Implementation__transfer_(address from, address to, uint256 amount) private virtual returns (bool) {
        if (from == address(0)) revert ERC20Implementation__CannotTransferFromAddressZero();
        if (to == address(0)) revert ERC20Implementation__CannotTransferToAddressZero();
        uint256 senderBalance = _erc20Implementation__balanceOf(from);
        uint256 recipientBalance = _erc20Implementation__balanceOf(to);
        if (senderBalance < amount) revert ERC20Implementation__InsufficientBalance();
        unchecked {
            uint256 newSenderBalance = senderBalance - amount;
            uint256 newRecipientBalance = recipientBalance + amount;
            _tokenStateSocket().setBalances(from, newSenderBalance);
            _tokenStateSocket().setBalances(to, newRecipientBalance);
        }
        emit Transfer(from, to, amount);
        return true;
    }

    function erc20Implementation__mint_(address account, uint256 amount) private virtual returns (bool) {
        if (account == address(0)) revert ERC20Implementation__CannotMintToAddressZero();
        uint256 newTotalSupply = _erc20Implementation__totalSupply() + amount;
        _tokenStateSocket().setTotalSupply(newTotalSupply);
        unchecked {
            uint256 currentBalance = _erc20Implementation__balanceOf(account);
            uint256 newBalance = currentBalance + amount;
            _tokenStateSocket().setBalances(account, newBalance);
        }
        emit Transfer(address(0), account, amount);
        return true;
    }

    function erc20Implementation__burn_(address account, uint256 amount) private virtual returns (bool) {
        if (account == address(0)) revert ERC20Implementation__CannotBurnFromAddressZero();
        uint256 currentBalance = _erc20Implementation__balanceOf(account);
        if (currentBalance < amount) revert ERC20Implementation__InsufficientBalance();
        unchecked {
            uint256 newBalance = currentBalance - amount;
            uint256 newTotalSupply = _erc20Implementation__totalSupply() - amount;
            _tokenStateSocket().setBalances(account, newBalance);
            _tokenStateSocket().setTotalSupply(newTotalSupply);
        }
        emit Transfer(account, address(0), amount);
        return true;
    }

    function erc20Implementation__approve_(address owner, address spender, uint256 amount) private returns (bool) {
        if (owner == address(0)) revert ERC20Implementation__CannotApproveFromAddressZero();
        if (spender == address(0)) revert ERC20Implementation__CannotApproveToAddressZero();
        _tokenStateSocket().setAllowances(owner, spender, amount);
        emit Approval(owner, spender, amount);
        return true;
    }

    function erc20Implementation__spendAllowance_(address owner, address spender, uint256 amount) private returns (bool) {
        uint256 currentAllowance = _erc20Implementation__allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            if (currentAllowance < amount) revert ERC20Implementation__InsufficientAllowance();
            unchecked {
                uint256 newAllowance = currentAllowance - amount;
                erc20Implementation__approve_(owner, spender, newAllowance);
            }
        }
        return true;
    }
}