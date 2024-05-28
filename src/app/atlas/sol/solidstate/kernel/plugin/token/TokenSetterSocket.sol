// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "./TokenStorageSlot.sol";
import "./TokenMetadataSocket.sol";

contract TokenSetterSocket is TokenStorageSlot, TokenMetadataSocket {
    event TokenSymbolChanged(string oldSymbol, string newSymbol);

    function _setTokenSymbol(string memory symbol) internal returns (bool) {
        string memory oldSymbol = _symbol();
        _tokenStorageSlot().symbol = symbol;
        emit TokenSymbolChanged(oldSymbol, symbol);
        return true;
    }
}