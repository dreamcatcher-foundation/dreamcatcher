// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IPlugIn } from "../../../IPlugIn.sol";
import { TokenBurnSdk } from "./TokenBurnSdk.sol";
import { AuthSdk } from "../auth/AuthSdk.sol";
import { ITokenBurnPlugIn } from "./ITokenBurnPlugIn.sol";

contract TokenBurnPlugIn is 
    IPlugIn,
    ITokenBurnPlugIn, 
    TokenBurnSdk, 
    AuthSdk {
    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](1);
        selectors[0] = bytes4(keccak256("burn(address,uint256)"));
        return selectors;
    }

    function burn(address account, uint256 amount) external returns (bool) {
        _onlyRole("*");
        _burn(account, amount);
        return true;
    }
}