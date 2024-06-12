// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Token } from "./Token.sol";

event TokenSetterLib__SymbolChanged(string oldSymbol, string newSymbol);

library TokenSetterLib {
    function setSymbol(Token storage token, string memory symbol) internal returns (bool) {
        string memory oldSymbol = token.inner.symbol;
        string memory newSymbol = token.inner.symbol = symbol;
        emit TokenSetterLib__SymbolChanged(oldSymbol, newSymbol);
        return true;
    }
}