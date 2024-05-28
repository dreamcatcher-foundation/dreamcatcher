// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "./TokenBurnSocket.sol";
import "../auth/AuthSocket.sol";
import "../../../IFacet.sol";

interface ITokenBurnFacet {
    function burn(address account, uint256 amount) external returns (bool);
}

contract TokenBurnFacet is IFacet, TokenBurnSocket, AuthSocket {
    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](1);
        selectors[0] = bytes4(keccak256("burn(address,uint256)"));
        return selectors;
    }

    function burn(address account, uint256 amount) external returns (bool) {
        _onlyRole("owner");
        _burn(account, amount);
        return true;
    }
}