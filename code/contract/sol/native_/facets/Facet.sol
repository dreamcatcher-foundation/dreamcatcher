// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IFacet {
    function selectors() external pure returns (bytes4[] memory);
}

contract Facet is IFacet {
    function selectors() public pure virtual returns (bytes4[] memory);
}