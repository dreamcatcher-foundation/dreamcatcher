// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IFactory {
    event Deploy(address deployer, address instance, uint256 timestamp);

    function deployed() external view returns (address[] memory);
    function deploy() external returns (address);
}