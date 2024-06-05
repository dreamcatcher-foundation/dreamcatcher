// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { ISolidStateDiamond } from "./import/solidstate-v0.8.24/proxy/diamond/ISolidStateDiamond.sol";

interface IDiamond is ISolidStateDiamond {
    function install(address facet) external returns (bool);
    function reinstall(address facet) external returns (bool);
    function uninstall(address facet) external returns (bool);
    function replaceSelectors(address facet, bytes4[] memory selectors) external returns (bool);
    function pushSelectors(address facet, bytes4[] memory selectors) external returns (bool);
    function pullSelectors(bytes4[] memory selectors) external returns (bool);   
}