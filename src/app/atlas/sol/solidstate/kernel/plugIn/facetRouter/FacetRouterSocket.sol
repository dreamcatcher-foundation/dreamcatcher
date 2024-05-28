// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "./FacetRouterStorageSlot.sol";

contract FacetRouterSocket is FacetRouterStorageSlot {
    function _versionsOf(string memory facetId, uint256 version) internal view returns (address) {
        return _facetRouterStorageSlot().versions[facetId][version];
    }

    function _versionsOf(string memory facetId) internal view returns (address[] memory) {
        return _versionsOf(facetId);
    }

    function _versionsLengthOf(string memory facetId) internal view returns (uint256) {
        return _facetRouterStorageSlot().versions[facetId].length;
    }

    function _latestVersionOf(string memory facetId) internal view returns (address) {
        return _facetRouterStorageSlot().versions[facetId][_versionsLengthOf(facetId) - 1];
    }

    function _commit(string memory facetId, address facet) internal returns (bool) {
        _facetRouterStorageSlot().versions[facetId].push(facet);
        return true;
    }
}