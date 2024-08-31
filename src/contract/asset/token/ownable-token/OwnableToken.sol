// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {ERC20} from "../../../import/openzeppelin/token/ERC20/ERC20.sol";
import {Ownable} from "../../../import/openzeppelin/access/Ownable.sol";

contract OwnableToken is ERC20, Ownable {

    constructor(string memory name, string memory symbol, address owner) ERC20(name, symbol) Ownable(owner) {}

    function mint(address account, uint256 amount) external onlyOwner() {
        return _mint(account, amount);
    }

    function burn(address account, uint256 amount) external onlyOwner() {
        return _burn(account, amount);
    }
}