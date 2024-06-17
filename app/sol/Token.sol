// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IToken } from "./IToken.sol";
import { Ownable } from "./imports/openzeppelin/access/Ownable.sol";
import { ERC20 } from "./imports/openzeppelin/token/ERC20/ERC20.sol";

contract Token is IToken, Ownable, ERC20 {
    constructor(string memory name, string memory symbol)
    Ownable(msg.sender)
    ERC20(name, symbol) 
    {}

    function mint(address account, uint256 amount) public virtual onlyOwner() {
        _mint();
    }

    function burn(address account, uint256 amount) public virtual onlyOwner() {
        _burn();
    }
}