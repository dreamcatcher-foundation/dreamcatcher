// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IAdminNodePlugIn {
    function deploy(string memory daoName) external returns (address);
    function installFor(string memory daoName, string memory plugInName) external returns (bool);
    function uninstallFor(string memory daoName, string memory plugInName) external returns (bool);
}