// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { ISolidStateDiamond } from "./import/solidstate-v0.8.24/proxy/diamond/ISolidStateDiamond.sol";

/**
*    facetAddress
*    facetAddresses
*    facetFunctionSelectors
*    facets
*    getFallbackAddress
*    nomineeOwner
*    owner
*    supportsInterface
*
*    acceptOwnership
*    diamondCut
*    install
*    pullSelectors
*    pushSelectors
*    reinstall
*    replaceSelectors
*    setFallbackAddress
*    transferOwnership
*    uninstall
 */
interface INode is ISolidStateDiamond {
    function install(address plugIn) external returns (bool);
    function reinstall(address plugIn) external returns (bool);
    function uninstall(address plugIn) external returns (bool);
    function replaceSelectors(address plugIn, bytes4[] memory selectors) external returns (bool);
    function pushSelectors(address plugIn, bytes4[] memory selectors) external returns (bool);
    function pullSelectors(bytes4[] memory selectors) external returns (bool);   
}