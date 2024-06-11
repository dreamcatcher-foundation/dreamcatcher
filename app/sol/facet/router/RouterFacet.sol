// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IRouterFacet } from "./IRouterFacet.sol":
import { IFacet } from "../../../IFacet.sol";
import { Router } from "./Router.sol";
import { RouterLib } from "./RouterLib.sol";
import { AuthLib } from "../accessControl/auth/AuthLib.sol";
import { AuthSlot } from "../accessControl/auth/AuthSlot.sol";

contract RouterFacet is IFacet, IRouterFacet {
    using RouterLib for Router;
    using AuthLib for Auth;

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
        return _router().versionsOf(key, version);
    }

    function versionsOf(string memory key) external view returns (address[] memory) {
        return _router().versionsOf(key);
    }

    function versionsLengthOf(string memory key) external view returns (uint256) {
        return _router().versionsLengthOf(key);
    }

    function latestVersionOf(string memory key) external view returns (address) {
        return _router().latestVersionOf(key);
    }

    function commit(string memory key, address implementation) external returns (bool) {
        _auth().onlyRole("*");
        return _router().commit(key, implementation);
    }
}