// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

library TokenStorageLib {
    event Approval(address indexed owner, address indexed spender, uint256 amount);

    event Transfer(address indexed from, address indexed to, uint256 amount);

    sturct Token {
        mapping(address => uint256) balances_;
        mapping(address => mapping(address => uint256)) allowances_;
        uint256 totalSupply_;
    }

    function decimals(Token storage token) internal view returns (uint8) {
        return 18;
    }

    function totalSupply(Token storage token) internal view returns (uint256) {
        return token.totalSupply_;
    }

    function balanceOf(Token storage token, address account) internal view returns (uint256) {
        return token.balances_[account];
    }

    function allowance(Token storage token, address owner, address spender) internal view returns (uint256) {
        return token.allowances_[owner][spender];
    }

    function transfer(Token storage token, address to, uint256 amount) internal returns (bool) {
        address owner_ = msg.sender;
        return transfer_(token, owner_, to, amount);
    }

    function transferFrom(Token storage token, address from, address to, uint256 amount) internal returns (bool) {
        address spender_ = msg.sender;
        spendAllowance_(token, from, spender_, amount);
        return transfer_(token, from, to, amount);
    }

    function mint(Token storage token, address account, uint256 amount) internal returns (bool) {
        return mint_(token, account, amount);
    }

    function burn(Token storage token, address account, uint256 amount) internal returns (bool) {
        return burn_(token, account, amount);
    }

    function approve(Token storage token, address spender, uint256 amount) internal returns (bool) {
        address owner_ = msg.sender;
        approve_(token, owner_, spender, amount);
        return true;
    }

    function increaseAllowance(Token storage token, address spender, uint256 amount) internal returns (bool) {
        address owner_ = msg.sender;
        approve_(token, owner, spender, allowance(token, owner_, spender) + amount);
        return true;
    }

    function decreaseAllowance(Token storage token, address spender, uint256 amount) internal returns (bool) {
        address owner_ = msg.sender;
        uint256 currentAllowance_ = allowance(token, owner_, spender);
        require(currentAllowance_ >= amount, "TokenStorageLib: cannot decrease allowance below zero");
        unchecked {
            approve_(token, owner_, spender, currentAllowance_ - amount);
        }
        return true;
    }

    function transfer_(Token storage token, address from, address to, uint256 amount) private returns (bool) {
        require(from != address(0), "TokenStorageLib: cannot transfer from address zero");
        require(to != address(0), "TokenStorageLib: cannot transfer to address zero");
        uint256 fromBalance_ = token.balances_[from];
        require(fromBalance_ >= amount, "TokenStorageLib: insufficient balance");
        unchecked {
            token.balances_[from] = fromBalance_ - amount;
            token.balances_[to] += amount;
        }
        emit Transfer(from, to, amount);
        return true;
    }

    function mint_(Token storage token, address account, uint256 amount) private returns (bool) {
        require(account != address(0), "TokenStorageLib: cannot mint to address zero");
        token.totalSupply_ += amount;
        unchecked {
            token.balances_[account] += amount;
        }
        emit Transfer(address(0), account, amount);
        return true;
    }

    function burn_(Token storage token, address account, uint256 amount) private returns (bool) {
        require(account != address(0), "TokenStorageLib: cannot burn from address zero");
        uint256 accountBalance_ = token.balances_[account];
        require(accountBalance_ >= amount, "TokenStorageLib: insufficient balance");
        unchecked {
            token.balances_[account] = accountBalance_ - amount;
            token.totalSupply_ -= amount;
        }
        emit Transfer(account, address(0), amount);
        return true;
    }

    function approve_(Token storage token, address owner, address spender, uint256 amount) private returns (bool) {
        require(owner != address(0), "TokenStorageLib: cannot approve from address zero");
        require(spender != address(0), "TokenStorageLib: cannot approve to address zero");
        token.allowances_[owner][spender] = amount;
        emit Approval(owner, spender, amount);
        return true;
    }

    function spendAllowance_(Token storage token, address owner, address spender, uint256 amount) private returns (bool) {
        uint256 currentAllowance_ = allowance(token, owner, spender);
        if (currentAllowance_ != type(uint256).max) {
            require(currentAllowance_ >= amount, "TokenStorageLib: insufficient allowance");
            unchecked {
                approve_(token, owner, spender, currentAllowance_ - amount);
            }
        }
        return true;
    }
}

contract TokenStorage {
    bytes32 constant internal TOKEN_ = bytes32(uint256(keccak256("eip1967.TOKEN")) - 1);

    function token() internal pure returns (TokenStorageLib.Token storage sl) {
        bytes32 loc = TOKEN_;
        
        assembly {
            sl.slot := loc
        }
    }
}