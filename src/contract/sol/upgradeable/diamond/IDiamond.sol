// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IFacet} from "./IFacet.sol";
import {ISolidStateDiamond} from "../../import/solidstate-v0.8.24/proxy/diamond/ISolidStateDiamond.sol";

interface IDiamond is ISolidStateDiamond {
    function reconnect(IFacet facetI) external;
    function connect(IFacet facetI) external;
    function disconnect(IFacet facetI) external;
    function disconnect() external;
    function replaceSelectors(address implementation, bytes4[] memory selectors) external;
    function addSelectors(address implementation, bytes4[] memory selectors) external;
    function removeSelectors(bytes4[] memory selectors) external;
}