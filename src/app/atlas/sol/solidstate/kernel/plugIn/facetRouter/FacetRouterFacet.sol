// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "./FacetRouterSocket.sol";
import "../auth/AuthSocket.sol";
import "../../../IFacet.sol";

interface IFacetRouterFacet {
    function versionsOf(string memory facetId, uint256 version) external view returns (address);
    function versionsOf(string memory facetId) external view returns (address[] memory);
    function versionsLengthOf(string memory facetId) external view returns (uint256);
    function latestVersionOf(string memory facetId) external view returns (address);
    function commit(string memory facetId, address facet) external returns (bool);
}

contract FacetRouterFacet is IFacet, FacetRouterSocket {
    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](5);
        selectors[0] = bytes4(keccak256("versionsOf(string,uint256)"));
        selectors[1] = bytes4(keccak256("versionsOf(string)"));
        selectors[2] = bytes4(keccak256("versionsLengthOf(string)"));
        selectors[3] = bytes4(keccak256("latestVersionOf(string)"));
        selectors[4] = bytes4(keccak256("commit(string,address)"));
        return selectors;
    }

    function versionsOf(string memory facetId, uint256 version) external view returns (address) {
        return _versionsOf(facetId, version);
    }

    function versionsOf(string memory facetId) external view returns (address[] memory) {
        return _versionsOf(facetId);
    }

    function versionsLengthOf(string memory facetId) external view returns (uint256) {
        return _versionsLengthOf(facetId);
    }

    function latestVersionOf(string memory facetId) external view returns (address) {
        return _latestVersionOf(facetId);
    }

    function commit(string memory facetId, address facet) internal returns (bool) {
        _onlyRole("owner");
        return _commit(facetId, facet);
    }
}