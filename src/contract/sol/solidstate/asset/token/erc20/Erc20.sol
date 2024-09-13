// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {ERC20} from "../../../../import/openzeppelin/token/ERC20/ERC20.Sol";

contract Erc20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}
}