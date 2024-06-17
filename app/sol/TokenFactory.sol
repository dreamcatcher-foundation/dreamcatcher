// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Token } from "./Token.sol";

interface ITokenFactory {
    deploy(string memory name, string memory symbol) external returns (address);
}

contract TokenFactory {
    constructor() {}

    function deploy(string memory name, string memory symbol) public returns (address) {
        Token token = new Token(name, symbol);
        token.transferOwnership(msg.sender);
        return address(token);
    }
}