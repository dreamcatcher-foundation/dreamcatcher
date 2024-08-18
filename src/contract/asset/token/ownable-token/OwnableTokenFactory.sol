// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { OwnableToken } from "./OwnableToken.sol";

contract OwnableTokenFactory {
    
    function deploy(string memory name, string memory symbol, address owner) public returns (address) {
        return address(new OwnableToken(name, symbol, owner));
    }
}