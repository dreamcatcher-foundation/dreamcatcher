// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { RouterSlot } from "./RouterSlot.sol";

contract RouterSdk is RouterSlot {
    error NoCommitsFound();

    function _versionsOf(string memory key, uint256 version) internal view returns (address) {
        return _versions()[key][version];
    }

    function _versionsOf(string memory key) internal view returns (address[] memory) {
        return _versionsOf(key);
    }

    function _versionsLengthOf(string memory key) internal view returns (uint256) {
        return _versions()[key].length;
    }

    function _latestVersionOf(string memory key) internal view returns (address) {
        if (_versionsLengthOf(key) <= 0) {
            revert NoCommitsFound();
        }
        return _versions()[key][_versionsLengthOf(key) - 1];
    }

    function _commit(string memory key, address implementation) internal returns (bool) {
        _versions()[key].push(implementation);
        return true;
    }
}