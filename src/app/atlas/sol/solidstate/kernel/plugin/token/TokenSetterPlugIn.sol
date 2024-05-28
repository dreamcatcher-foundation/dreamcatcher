// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "./TokenSetterSocket.sol";
import "../auth/AuthSocket.sol";

interface ITokenSetterPlugIn {
    function setTokenSymbol(string memory symbol) external returns (bool);
}

contract TokenSetterPlugIn is TokenSetterSocket, AuthSocket {
    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](1);
        selectors[0] = bytes4(keccak256("setTokenSymbol(string)"));
        return selectors;
    }

    function setTokenSymbol(string memory symbol) external returns (bool) {
        _onlyRole("owner");
        _setTokenSymbol(symbol);
        return true;
    }
}