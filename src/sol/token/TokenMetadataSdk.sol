// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { TokenSocket } from "./TokenSocket.sol";

contract TokenMetadataSdk is TokenSocket {
    
    function _name() internal view returns (string memory) {
        return _tokenSocket().name();
    }

    function _symbol() internal view returns (string memory) {
        return _tokenSocket().symbol();
    }

    function _decimals() internal pure returns (uint8) {
        return 18;
    }

    function _setName(string memory name) internal returns (bool) {
        (string memory oldName, string memory newName) = _tokenSocket().setName(name);
        emit NameChange(oldName, newName);
        return true;
    }

    function _setSymbol(string memory symbol) internal returns (bool) {
        _tokenSocket().setSymbol(symbol);
        return true;
    }
}