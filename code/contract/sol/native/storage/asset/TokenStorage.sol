// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library TokenStorageLibrary {
    event Approval(address indexed owner, address indexed spender, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);
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

    /**
     * @dev Returns the token name.
     * @param token The Token struct containing token data.
     * @return string The name of the token.
     */
    function name(Token storage token) internal view returns (string memory) {
        return token.hidden.name;
    }

    /**
     * @dev Returns the token symbol.
     * @param token The Token struct containing token data.
     * @return string The symbol of the token.
     */
    function symbol(Token storage token) internal view returns (string memory) {
        return token.hidden.symbol;
    }

    /**
     * @dev Returns the token decimals (fixed to 64).
     * @param token The Token struct containing token data.
     * @return uint8 The number of decimals for the token.
     */
    function decimals(Token storage token) internal pure returns (uint8) {
        return 64;
    }

    /**
     * @dev Returns the total token supply.
     * @param token The Token struct containing token data.
     * @return uint256 The total supply of the token.
     */
    function totalSupply(Token storage token) internal view returns (uint256) {
        return token.hidden.totalSupply;
    }

    /**
     * @dev Returns the token balance of a specific address.
     * @param token The Token struct containing token data.
     * @param account The address for which to check the balance.
     * @return uint256 The token balance of the specified address.
     */
    function balanceOf(Token storage token, address account) internal view returns (uint256) {
        return token.hidden.balances[account];
    }

    /**
     * @dev Returns the allowance of one address for another.
     * @param token The Token struct containing token data.
     * @param owner The address that owns the tokens.
     * @param spender The address that is allowed to spend the tokens.
     * @return uint256 The allowance for spending the tokens.
     */
    function allowance(Token storage token, address owner, address spender) internal view returns (uint256) {
        return token.hidden.allowances[owner][spender];
    }

    /**
     * @dev Sets the token name.
     * @param token The Token struct containing token data.
     * @param name The new name for the token.
     * @return Token The updated Token struct.
     */
    function setName(Token storage token, string memory name) internal returns (Token storage) {
        token.hidden.name = name;
        emit ChangedTokenName(name);
        return token;
    }

    /**
     * @dev Sets the token symbol.
     * @param token The Token struct containing token data.
     * @param symbol The new symbol for the token.
     * @return Token The updated Token struct.
     */
    function setSymbol(Token storage token, string memory symbol) internal returns (Token storage) {
        token.hidden.symbol = symbol;
        emit ChangedTokenSymbol(symbol);
        return token;
    }

    /**
     * @dev Transfers tokens from the caller's account to another address.
     * @param token The Token struct containing token data.
     * @param to The address to which tokens are transferred.
     * @param amount The amount of tokens to transfer.
     * @return Token The updated Token struct.
     */
    function transfer(Token storage token, address to, uint256 amount) internal returns (Token storage) {
        address owner = msg.sender;
        _transfer(token, owner, to, amount);
        return token;
    }

    /**
     * @dev Transfers tokens from one address to another using the allowance mechanism.
     * @param token The Token struct containing token data.
     * @param from The address from which tokens are transferred.
     * @param to The address to which tokens are transferred.
     * @param amount The amount of tokens to transfer.
     * @return Token The updated Token struct.
     */
    function transferFrom(Token storage token, address from, address to, uint256 amount) internal returns (Token storage) {
        address spender = msg.sender;
        _spendAllowance(token, from, spender, amount);
        _transfer(token, from, to, amount);
        return token;
    }

    /**
     * @dev Mints new tokens and adds them to the specified account.
     * @param token The Token struct containing token data.
     * @param account The address to which tokens are minted.
     * @param amount The amount of tokens to mint.
     * @return Token The updated Token struct.
     */
    function mint(Token storage token, address account, uint256 amount) internal returns (Token storage) {
        return _mint(token, account, amount);
    }

    /**
     * @dev Burns tokens from the specified account.
     * @param token The Token struct containing token data.
     * @param account The address from which tokens are burned.
     * @param amount The amount of tokens to burn.
     * @return Token The updated Token struct.
     */
    function burn(Token storage token, address account, uint256 amount) internal returns (Token storage) {
        return _burn(token, account, amount);
    }

    /**
     * @dev Approves another address to spend tokens on behalf of the caller.
     * @param token The Token struct containing token data.
     * @param spender The address to which spending is approved.
     * @param amount The amount of tokens to approve for spending.
     * @return Token The updated Token struct.
     */
    function approve(Token storage token, address spender, uint256 amount) internal returns (Token storage) {
        address owner = msg.sender;
        _approve(token, owner, spender, amount);
        return token;
    }

    /**
     * @dev Increases the allowance for another address to spend tokens on behalf of the caller.
     * @param token The Token struct containing token data.
     * @param spender The address for which to increase the allowance.
     * @param amount The amount by which to increase the allowance.
     * @return Token The updated Token struct.
     */
    function increaseAllowance(Token storage token, address spender, uint256 amount) internal returns (Token storage) {
        address owner = msg.sender;
        _approve(token, owner, spender, allowance(token, owner, spender) + amount);
        return token;
    }

    /**
     * @dev Decreases the allowance for another address to spend tokens on behalf of the caller.
     * @param token The Token struct containing token data.
     * @param spender The address for which to decrease the allowance.
     * @param amount The amount by which to decrease the allowance.
     * @return Token The updated Token struct.
     */
    function decreaseAllowance(Token storage token, address spender, uint256 amount) internal returns (Token storage) {
        address owner = msg.sender;
        uint256 currentAllowance = allowance(token, owner, spender);
        require(currentAllowance >= amount, "TokenStorageLibrary: cannot decrease allowance below zero");
        unchecked {
            _approve(token, owner, spender, currentAllowance - amount);
        }
        return token;
    }

    /**
     * @dev Internal function to transfer tokens from one address to another.
     * @param token The Token struct containing token data.
     * @param from The address from which tokens are transferred.
     * @param to The address to which tokens are transferred.
     * @param amount The amount of tokens to transfer.
     * @return Token The updated Token struct.
     */
    function _transfer(Token storage token, address from, address to, uint256 amount) private returns (Token storage) {
        require(from != address(0), "TokenStorageLibrary: cannot transfer from address zero");
        require(to != address(0), "TokenStorageLibrary: cannot transfer to address zero");
        uint256 fromBalance = token.hidden.balances[from];
        require(fromBalance >= amount, "TokenStorageLibrary: insufficient balance");
        unchecked {
            token.hidden.balances[from] = fromBalance - amount;
            token.hidden.balances[to] += amount;
        }
        emit Transfer(from, to, amount);
        return token;
    }

    /**
     * @dev Internal function to mint new tokens and add them to the specified account.
     * @param token The Token struct containing token data.
     * @param account The address to which tokens are minted.
     * @param amount The amount of tokens to mint.
     * @return Token The updated Token struct.
     */
    function _mint(Token storage token, address account, uint256 amount) private returns (Token storage) {
        require(account != address(0), "TokenStorageLibrary: cannot mint to address zero");
        token.hidden.totalSupply += amount;
        unchecked {
            token.hidden.balances[account] += amount;
        }
        emit Transfer(address(0), account, amount);
        return token;
    }

    /**
     * @dev Internal function to burn tokens from the specified account.
     * @param token The Token struct containing token data.
     * @param account The address from which tokens are burned.
     * @param amount The amount of tokens to burn.
     * @return Token The updated Token struct.
     */
    function _burn(Token storage token, address account, uint256 amount) private returns (Token storage) {
        require(account != address(0), "TokenStorageLibrary: cannot burn from address zero");
        uint256 accountBalance = token.hidden.balances[account];
        require(accountBalance >= amount, "TokenStorageLibrary: insufficient balance");
        unchecked {
            token.hidden.balances[account] = accountBalance - amount;
            token.hidden.totalSupply -= amount;
        }
        emit Transfer(account, address(0), amount);
        return token;
    }

    /**
     * @dev Internal function to approve another address to spend tokens on behalf of the owner.
     * @param token The Token struct containing token data.
     * @param owner The address that owns the tokens.
     * @param spender The address to which spending is approved.
     * @param amount The amount of tokens to approve for spending.
     * @return Token The updated Token struct.
     */
    function _approve(Token storage token, address owner, address spender, uint256 amount) private returns (Token storage) {
        require(owner != address(0), "TokenStorageLibrary: cannot approve from address zero");
        require(spender != address(0), "TokenStorageLibrary: cannot approve to address zero");
        token.hidden.allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
        return token;
    }

    /**
     * @dev Internal function to spend allowance for another address.
     * @param token The Token struct containing token data.
     * @param owner The address that owns the tokens.
     * @param spender The address to which spending is allowed.
     * @param amount The amount of tokens to allow for spending.
     * @return Token The updated Token struct.
     */
    function _spendAllowance(Token storage token, address owner, address spender, uint256 amount) private returns (Token storage) {
        uint256 currentAllowance = allowance(token, owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "TokenStorageLibrary: insufficient allowance");
            unchecked {
                _approve(token, owner, spender, currentAllowance - amount);
            }
        }
        return token;
    }
}

contract TokenStorage {
    bytes32 constant internal TOKEN = bytes32(uint256(keccak256("eip1967.token")) - 1);

    /**
     * @dev Returns the storage pointer for the Token struct.
     * @return TokenMemoryLibrary.Token The Token struct storage pointer.
     */
    function token() internal pure returns (TokenMemoryLibrary.Token storage sl) {
        assembly {
            sl.slot := TOKEN
        }
    }
}