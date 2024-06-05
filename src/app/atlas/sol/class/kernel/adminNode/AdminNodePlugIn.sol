// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IPlugIn } from "../../../IPlugIn.sol";
import { IAdminNodePlugIn } from "./IAdminNodePlugIn.sol";
import { AdminNodeSdk } from "./AdminNodeSdk.sol";

contract AdminNodePlugIn is 
    IPlugIn,
    IAdminNodePlugIn,
    AdminNodeSdk {
    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](3);
        selectors[0] = bytes4(keccak256("deploy(string)"));
        selectors[1] = bytes4(keccak256("installFor(string,string)"));
        selectors[2] = bytes4(keccak256("uninstallFor(string,string)"));
        return selectors;
    }

    function deploy(string memory daoName) external returns (address) {
        return _deploy(daoName);
    }

    function installFor(string memory daoName, string memory plugInName) external returns (bool) {
        return _installFor(daoName, plugInName);
    }

    function uninstallFor(string memory daoName, string memory plugInName) external returns (bool) {
        return _uninstallFor(daoName, plugInName);
    }
}