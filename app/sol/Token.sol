// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IERC20 } from "./imports/openzeppelin/token/ERC20/IERC20.sol";
import { IERC20Metadata } from "./imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { Ownable } from "./imports/openzeppelin/access/Ownable.sol";
import { ERC20 } from "./imports/openzeppelin/token/ERC20/ERC20.sol";

interface ITokenFactory {
    function deploy(string memory name, string memory symbol) external returns (address);
}

contract TokenFactory {
    constructor() {}

    function deploy(string memory name, string memory symbol) public returns (address) {
        Token token = new Token(name, symbol);
        token.transferOwnership(msg.sender);
        return address(token);
    }
}

interface IToken is IERC20, IERC20Metadata {
    function owner() external view returns (address);
    function renounceOwnership() external;
    function transferOwnership(address newOwner) external;
    function mint(address account, uint256 amount) external;
    function burn(address account, uint256 amount) external;
}

contract Token is Ownable, ERC20 {
    constructor(string memory name, string memory symbol)
    Ownable(msg.sender)
    ERC20(name, symbol) 
    {}

    function mint(address account, uint256 amount) public virtual onlyOwner() {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public virtual onlyOwner() {
        _burn(account, amount);
    }
}