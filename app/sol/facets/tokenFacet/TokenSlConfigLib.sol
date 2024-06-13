// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { TokenSl } from "./TokenSl.sol";

library TokenSlConfigLib {
    event NameSetTo(string indexed oldName, string indexed newName);
    event SymbolSetTo(string indexed oldSymbol, string indexed newSymbol);

    error NameCanOnlyBeSetOnce();
    error SymbolCanOnlyBeSetOnce();

    function setName(TokenSl storage sl, string memory name) internal returns (bool) {
        if (!sl._nameIsSet) {
            revert NameCanOnlyBeSetOnce();
        }
        string memory oldName = sl._name;
        string memory newName = sl._name = name;
        emit NameSetTo(oldName, newName);
        return true;
    }

    function setSymbol(TokenSl storage sl, string memory symbol) internal returns (bool) {
        if (!sl._symbolIsSet) {
            revert SymbolCanOnlyBeSetOnce();
        }
        string memory oldSymbol = sl._symbol;
        string memory newSymbol = sl._symbol = symbol;
        emit SymbolSetTo(oldSymbol, newSymbol);
        return true;
    }
}