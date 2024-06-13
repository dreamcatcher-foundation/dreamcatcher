// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { TokenSl } from "./TokenSl.sol";

library TokenSlConfigLib {
    event NameSetTo(string memory oldName, string memory newName);
    event SymbolSetTo(string memory oldSymbol, string memory newSymbol);

    error NameCanOnlyBeSetOnce();
    error SymbolCanOnlyBeSetOnce();

    function setName(TokenSl storage sl, string memory name) internal returns (bool) {
        if (sl._name == "") {
            revert NameCanOnlyBeSetOnce();
        }
        string memory oldName = sl._name;
        string memory newName = sl._name = name;
        emit NameSetTo(oldName, newName);
        return true;
    }

    function setSymbol(TokenSl storage sl, string memory symbol) internal returns (bool) {
        if (sl._symbol == "") {
            revert SymbolCanOnlyBeSetOnce();
        }
        string memory oldSymbol = sl._symbol;
        string memory newSymbol = sl._symbol = symbol;
        emit SymbolSetTo(oldSymbol, newSymbol);
        return true;
    }
}