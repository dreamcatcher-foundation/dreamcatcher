// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library TokenStorageLibrary {
    event Approval(address owner, address spender, uint256 amount);
    event Transfer(address from, address to, uint256 amount);
    event ChangedTokenName(string name);
    event ChangedTokenSymbol(string symbol);

    struct Token {
        Hidden hidden;
    }

    struct Hidden {
        mapping(address => uint256) balances;
        mapping(address => mapping(address => uint256)) allowances;
        uint256 totalSupply;
        string name;
        string symbol;
    }

    function name(Token storage token) internal view returns (string memory) {
        return token.hidden.name;
    }

    function symbol(Token storage token) internal view returns (string memory) {
        return token.hidden.symbol;
    }

    function decimals(Token storage token) internal pure returns (uint8) {
        return 18;
    }

    function totalSupply(Token storage token) internal view returns (uint256) {
        return token.hidden.totalSupply;
    }

    function balanceOf(Token storage token, address account) internal view returns (uint256) {
        return token.hidden.balances[account];
    }

    function allowance(Token storage token, address owner, address spender) internal view returns (uint256) {
        return token.hidden.allowances[owner][spender];
    }

    function setName(Token storage token, string memory name) internal returns (Token storage) {
        token.hidden.name = name;
        emit ChangedTokenName(name);
        return token;
    }

    function setSymbol(Token storage token, string memory symbol) internal returns (Token storage) {
        token.hidden.symbol = symbol;
        emit ChangedTokenSymbol(symbol);
        return token;
    }

    function transfer(Token storage token, address to, uint256 amount) internal returns (Token storage) {
        address owner = msg.sender;
        _transfer(token, owner, to, amount);
        return token;
    }

    function transferFrom(Token storage token, address from, address to, uint256 amount) internal returns (Token storage) {
        address spender = msg.sender;
        _spendAllowance(token, from, spender, amount);
        _transfer(token, from, to, amount);
        return token;
    }

    function mint(Token storage token, address account, uint256 amount) internal returns (Token storage) {
        return _mint(token, account, amount);
    }

    function burn(Token storage token, address account, uint256 amount) internal returns (Token storage) {
        return _burn(token, account, amount);
    }

    function approve(Token storage token, address spender, uint256 amount) internal returns (Token storage) {
        address owner = msg.sender;
        _approve(token, owner, spender, amount);
        return token;
    }

    function increaseAllowance(Token storage token, address spender, uint256 amount) internal returns (Token storage) {
        address owner = msg.sender;
        _approve(token, owner, spender, allowance(token, owner, spender) + amount);
        return token;
    }

    function decreaseAllowance(Token storage token, address spender, uint256 amount) internal returns (Token storage) {
        address owner = msg.sender;
        uint256 currentAllowance = allowance(token, owner, spender);
        require(currentAllowance >= amount, 'TokenMemoryLibrary: cannot decrease allowance below zero');
        unchecked {
            _approve(token, owner, spender, currentAllowance - amount);
        }
        return token;
    }

    function _transfer(Token storage token, address from, address to, uint256 amount) private returns (Token storage) {
        require(from != address(0), 'TokenMemoryLibrary: cannot transfer from address zero');
        require(to != address(0), 'TokenMemoryLibrary: cannot transfer to address zero');
        uint256 fromBalance = token.hidden.balances[from];
        require(fromBalance >= amount, 'TokenMemoryLibrary: insufficient balance');
        unchecked {
            token.hidden.balances[from] = fromBalance - amount;
            token.hidden.balances[to] += amount;
        }
        emit Transfer(from, to, amount);
        return token;
    }

    function _mint(Token storage token, address account, uint256 amount) private returns (Token storage) {
        require(account != address(0), 'TokenMemoryLibrary: cannot mint to address zero');
        token.hidden.totalSupply += amount;
        unchecked {
            token.hidden.balances[account] += amount;
        }
        emit Transfer(address(0), account, amount);
        return token;
    }

    function _burn(Token storage token, address account, uint256 amount) private returns (Token storage) {
        require(account != address(0), 'TokenMemoryLibrary: cannot burn from address zero');
        uint256 accountBalance = token.hidden.balances[account];
        require(accountBalance >= amount, 'Token: insufficient balance');
        unchecked {
            token.hidden.balances[account] = accountBalance - amount;
            token.hidden.totalSupply -= amount;
        }
        emit Transfer(account, address(0), amount);
        return token;
    }

    function _approve(Token storage token, address owner, address spender, uint256 amount) private returns (Token storage) {
        require(owner != address(0), 'TokenMemoryLibrary: cannot approve from address zero');
        require(spender != address(0), 'TokenMemoryLibrary: cannot approve to address zero');
        token.hidden.allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
        return token;
    }

    function _spendAllowance(Token storage token, address owner, address spender, uint256 amount) private returns (Token storage) {
        uint256 currentAllowance = allowance(token, owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, 'TokenMemoryLibrary: insufficient allowance');
            unchecked {
                _approve(token, owner, spender, currentAllowance - amount);
            }
        }
        return token;
    }
}

contract TokenStorage {
    bytes32 constant internal TOKEN = bytes32(uint256(keccak256('eip1967.token')) - 1);

    function token() internal pure returns (TokenMemoryLibrary.Token storage sl) {
        assembly {
            sl.slot := TOKEN
        }
    }
}