// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface ILauncher {
    event Launch();

    function launch() external view returns (address);
}