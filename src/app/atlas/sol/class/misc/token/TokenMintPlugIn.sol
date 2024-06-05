// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IPlugIn } from "../../../IPlugIn.sol";
import { ITokenMintFacet } from "../../../IFacet.sol";
import { TokenMintSdk } from "./TokenMintSdk.sol";
import { AuthSdk } from "../auth/AuthSdk.sol";

contract TokenMintPlugIn is
    IPlugIn,
    ITokenMintFacet, 
    TokenMintSdk, 
    AuthSdk {
    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](1);
        selectors[0] = bytes4(keccak256("mint(address,uint256)"));
        return selectors;
    }

    function mint(address account, uint256 amount) external onlyRole("*") returns (bool) {
        _mint(account, amount);
        return true;
    }
}