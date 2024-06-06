// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IDeployer } from "./IDeployer.sol";

interface INodeDeployer is IDeployer {
    function owner() external view returns (address);
    function renounceOwnership() external;
    function transferOwnership(address account) external;
}