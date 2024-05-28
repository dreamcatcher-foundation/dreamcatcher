// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "./PlugInRouterStorageSlot.sol";

contract PlugInRouterSocket is PlugInRouterStorageSlot {
    function _versionsOf(string memory plugInId, uint256 version) internal view returns (address) {
        return _plugInRouterStorageSlot().versions[plugInId][version];
    }

    function _versionsOf(string memory plugInId) internal view returns (address[] memory) {
        return _versionsOf(plugInId);
    }

    function _versionsLengthOf(string memory plugInId) internal view returns (uint256) {
        return _plugInRouterStorageSlot().versions[plugInId].length;
    }

    function _latestVersionOf(string memory plugInId) internal view returns (address) {
        return _plugInRouterStorageSlot().versions[plugInId][_versionsLengthOf(plugInId) - 1];
    }

    function _commit(string memory plugInId, address plugIn) internal returns (bool) {
        _plugInRouterStorageSlot().versions[plugInId].push(plugIn);
        return true;
    }
}