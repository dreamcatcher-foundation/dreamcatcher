// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { AdminNodeSlot } from "./AdminNodeSlot.sol";
import { RouterSdk } from "../router/RouterSdk.sol";
import { INode } from "../../../INode.sol";
import { INodeDeployer } from "../../../deployer/INodeDeployer.sol";

contract AdminNodeSdk is
    AdminNodeSlot,
    RouterSdk {
    error DaoNameIsAlreadyInUse();
    error Unauthorized();

    function _daoNode(string memory daoName) internal view returns (address) {
        return _children()[daoName].node;
    }

    function _daoOwner(string memory daoName) internal view returns (address) {
        return _children()[daoName].owner;
    }

    function _register(address child) internal returns (bool) {
        
    }

    function _deploy(string memory daoName) internal returns (address) {
        if (_children()[daoName].node != address(0)) {
            revert DaoNameIsAlreadyInUse();
        }
        address version = _latestVersionOf("NodeDeployer");
        INodeDeployer deployer = INodeDeployer(version);
        address deployed = deployer.deploy();
        INode node = INode(payable(deployed));
        node.acceptOwnership();
        address authPlugInVersion = _latestVersionOf("AuthPlugIn");
        node.install(authPlugInVersion);
        _children()[daoName].node = address(node);
        _children()[daoName].owner = msg.sender;
        return _children()[daoName].node;
    }

    function _installFor(string memory daoName, string memory plugInName) internal returns (bool) {
        if (_children()[daoName].owner != msg.sender) {
            revert Unauthorized();
        }
        INode(payable(_children()[daoName].node)).install(_latestVersionOf(plugInName));
        return true;
    }

    function _uninstallFor(string memory daoName, string memory plugInName) internal returns (bool) {
        if (_children()[daoName].owner != msg.sender) {
            revert Unauthorized();
        }
        INode(payable(_children()[daoName].node)).uninstall(_latestVersionOf(plugInName));
        return true;
    }
}