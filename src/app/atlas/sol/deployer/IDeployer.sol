// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IDeployer {
    event Deployment(address);

    function deploy() external returns (address);
}