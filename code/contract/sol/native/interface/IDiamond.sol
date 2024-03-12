// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import '../../non-native/solidstate-v0.8.24/proxy/diamond/ISolidStateDiamond';

interface IDiamond is ISolidStateDiamond {
    function addSelectors(address implementation, bytes4[] memory selectors) external returns (bool);
    function removeSelectors(address implementation, bytes4[] memory selectors) external returns (bool);
    function install(address facet) external returns (bool);
    function uninstall(address facet) external returns (bool);
}