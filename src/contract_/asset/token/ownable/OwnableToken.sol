// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IOwnableToken} from "./IOwnableToken.sol";
import {ERC20} from "../../../import/openzeppelin/token/ERC20/ERC20.sol";
import {Ownable} from "../../../import/openzeppelin/access/Ownable.sol";

contract OwnableToken is IOwnableToken, ERC20, Ownable {
    
    constructor(string memory name, string memory symbol, address owner) ERC20(name, symbol) Ownable(owner) {}

    function owner() public view virtual override(IOwnableToken, Ownable) returns (address) {
        return Ownable.owner();
    }

    function transferOwnership(address account) public virtual override(IOwnableToken, Ownable) {
        return Ownable.transferOwnership(account);
    }

    function renounceOwnership() public virtual override(IOwnableToken, Ownable) {
        return Ownable.renounceOwnership();
    }

    function mint(address account, uint256 amount) public virtual onlyOwner() {
        return _mint(account, amount);
    }

    function burn(address account, uint256 amount) public virtual onlyOwner() {
        return _burn(account, amount);
    }
}