// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "./RouterSlot.sol":

contract RouterPort is RouterSlot {
    function _versionsOf(string memory facetId, uint256 version) internal view returns (address) {
        return _router()._versions[facetId][version];
    }

    function _versionsOf(string memory facetId) internal view returns (address[] memory) {
        return _router()._versions[facetId];
    }

    function _versionsLengthOf(string memory facetId) internal view returns (uint256) {
        return _router()._versions[facetId].length;
    }

    function _latestVersionOf(string memory facetId) internal view returns (address) {
        return _router()._versions[facetId][_versionsLengthOf(id) - 1];
    }

    function _commit(string memory facetId, address facet) internal returns (bool) {
        _router()._versions[facetId].push(facet);
        return true;
    }
}