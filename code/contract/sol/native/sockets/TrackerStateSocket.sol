// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import '../Mods.sol';
import './SocketError.sol';
import '../mods/state/TrackerState.sol';

contract TrackerState is SocketError, Mods {
    function _trackerStateSocket() internal view virtual returns (ITrackerStateMod) {
        bytes32 socket = keccak256('TrackerStateMod');
        address module = mods()[socket];
        bool moduleIsMissing = module == address(0);
        if (moduleIsMissing) {
            revert SocketError__MissingModule(socket);
        }
        return ITrackerStateMod(module);
    }
}