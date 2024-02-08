// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "contracts/polygon/solidstate/ERC20/Token.sol";

interface IDREAM is IToken {}

contract DREAM is Token {
    constructor() Token("Dream", "DREAM", 200000000) {}
}