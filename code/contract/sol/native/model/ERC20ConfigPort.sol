// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "./TokenSlot.sol";

contract ERC20ConfigPort is TokenSlot {
    event ERC20Config(string name, string symbol);
    
    function _configEmbeddedToken(address memory name, string memory symbol) internal returns (bool) {
        _token()._name = name;
        _token()._symbol = symbol;
        emit ERC20Config(name, symbol);
        return true;
    }
}