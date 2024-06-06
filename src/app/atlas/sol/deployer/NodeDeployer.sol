// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { INodeDeployer } from "./INodeDeployer.sol";
import { Ownable } from "../import/openzeppelin/access/Ownable.sol";
import { Node } from "../Node.sol";

contract NodeDeployer is INodeDeployer, Ownable {
    constructor() Ownable(msg.sender) {}

    function owner() public view override(INodeDeployer, Ownable) returns (address) {
       return Ownable.owner();
    }

    function renounceOwnership() public override(INodeDeployer, Ownable) {
        return Ownable.renounceOwnership();
    }

    function transferOwnership(address account) public override(INodeDeployer, Ownable) {
        return Ownable.transferOwnership(account);
    }

    function deploy() external onlyOwner() returns (address) {
        Node node = new Node();
        node.transferOwnership(owner());
        emit Deployment(address(node));
        return address(node);
    }
}