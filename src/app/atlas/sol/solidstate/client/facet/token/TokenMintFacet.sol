// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "./TokenMintSocket.sol";
import "../auth/AuthSocket.sol";
import "../../../IFacet.sol";

interface ITokenMintFacet {
    function mint(address account, uint256 amount) external returns (bool);
}

contract TokenMintFacet is IFacet, TokenMintSocket, AuthSocket {
    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](1);
        selectors[0] = bytes4(keccak256("mint(address,uint256)"));
        return selectors;
    }

    function mint(address account, uint256 amount) external returns (bool) {
        _onlyRole("owner");
        _mint(account, amount);
        return true;
    }
}