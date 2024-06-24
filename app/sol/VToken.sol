// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Ownable } from "./imports/openzeppelin/access/Ownable.sol";
import { ERC20 } from "./imports/openzeppelin/token/ERC20/ERC20.sol";

contract VToken is Ownable, ERC20 {
    constructor(string memory name, string memory symbol, address owner) Ownable(owner) ERC20(name, symbol) {}

    function mint(address account, uint256 amount) public onlyOwner() {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public onlyOwner() {
        _burn(account, amount);
    }
}