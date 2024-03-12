// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Token.sol";

interface IDREAM is IToken {}

contract DREAM is Token {
    constructor() Token("Dream", "DREAM", 200000000) {}
}