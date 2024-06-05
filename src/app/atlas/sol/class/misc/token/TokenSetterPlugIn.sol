// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IPlugIn } from "../../../IPlugIn.sol";
import { ITokenSetterFacet } from "./ITokenSetterFacet.sol";
import { TokenSetterSdk } from "./TokenSetterSdk.sol";
import { AuthSdk } from "../auth/AuthSdk.sol";

contract TokenSetterPlugIn is 
    IPlugIn,
    ITokenSetterFacet, 
    TokenSetterSdk, 
    AuthSdk {
    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](1);
        selectors[0] = bytes4(keccak256("setTokenSymbol(string)"));
        return selectors;
    }

    function setTokenSymbol(string memory symbol) external onlyRole("*") returns (bool) {
        _setTokenSymbol(symbol);
        return true;
    }
}