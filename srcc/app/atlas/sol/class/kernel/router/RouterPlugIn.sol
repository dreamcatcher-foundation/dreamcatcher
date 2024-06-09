// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IRouterPlugIn } from "./IRouterPlugIn.sol";
import { IPlugIn } from "../../../IPlugIn.sol";
import { RouterSdk } from "./RouterSdk.sol";
import { AuthSdk } from "../../misc/auth/AuthSdk.sol";

contract RouterPlugIn is 
    IPlugIn, 
    IRouterPlugIn, 
    RouterSdk, 
    AuthSdk {
    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](5);
        selectors[0] = bytes4(keccak256("versionsOf(string,uint256)"));
        selectors[1] = bytes4(keccak256("versionsOf(string)"));
        selectors[2] = bytes4(keccak256("versionsLengthOf(string)"));
        selectors[3] = bytes4(keccak256("latestVersionOf(string)"));
        selectors[4] = bytes4(keccak256("commit(string,address)"));
        return selectors;
    }

    function versionsOf(string memory key, uint256 version) external view returns (address) {
        return _versionsOf(key, version);
    }

    function versionsOf(string memory key) external view returns (address[] memory) {
        return _versionsOf(key);
    }

    function versionsLengthOf(string memory key) external view returns (uint256) {
        return _versionsLengthOf(key);
    }

    function latestVersionOf(string memory key) external view returns (address) {
        return _latestVersionOf(key);
    }

    function commit(string memory key, address implementation) external onlyRole("*") returns (bool) {
        return _commit(key, implementation);
    }
}