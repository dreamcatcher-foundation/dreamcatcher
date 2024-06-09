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
        bytes4[] memory selectors = new bytes4[](5);
        selectors[0] = bytes4(keccak256("daoNode(string)"));
        selectors[1] = bytes4(keccak256("daoOwner(string)"));
        selectors[2] = bytes4(keccak256("deploy(string)"));
        selectors[3] = bytes4(keccak256("installFor(string,string)"));
        selectors[4] = bytes4(keccak256("uninstallFor(string,string)"));
        return selectors;
    }

    function daoNode(string memory daoName) external view returns (address) {
        return _daoNode(daoName);
    }

    function daoOwner(string memory daoName) external view returns (address) {
        return _daoOwner(daoName);
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