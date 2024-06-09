// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Node } from "../Node.sol";

contract NodeDeployer {
    event NodeDeployment(address);
    error AlreadyAssignedToControllerNode();
    error ControllerNodeNotFound();

    address private _controllerNode;

    function controllerNode() public view returns (address) {
        return _controllerNode;
    } 

    function assignToControllerNode(address newControllerNode) external returns (address) {
        if (controllerNode() != address(0)) {
            revert AlreadyAssignedToControllerNode();
        }
        return _controllerNode = newControllerNode;
    }

    function deploy() external returns (address) {
        if (controllerNode() == address(0)) {
            revert ControllerNodeNotFound();
        }
        Node node = new Node();
        node.transferOwnership(controllerNode());
        emit NodeDeployment(address(node));
        return address(node);
    }
}