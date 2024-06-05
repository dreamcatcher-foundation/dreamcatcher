// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { TokenSlot } from "./TokenSlot.sol";

contract TokenSetterSdk is 
    TokenSlot, 
    TokenMetadataSdk {
    event TokenSymbolChange(string oldSymbol, string newSymbol);

    function _setTokenSymbol(string memory symbol) internal returns (bool) {
        string memory oldSymbol = _token().symbol;
        string memory newSymbol = _token().symbol = symbol;
        emit TokenSymbolChange(oldSymbol, newSymbol);
        return true;
    }
}