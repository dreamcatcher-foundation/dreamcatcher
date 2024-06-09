// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import '../sockets/TrackerStateSocket.sol';

contract TrackerImplementation is TrackerStateSocket {
    error TrackerImplementation__DuplicateFound();
    error TrackerImplementation__NoEmptySlots();
    error TrackerImplementation__TokenNotFound();

    function _trackerImplementation__asset() internal view virtual returns () {
        _trackerStateSocket().get(0);
    }

    function _trackerImplementation__startTrackingToken(address token) internal virtual returns (bool) {
        uint8 emptySlot = 128;
        for (uint8 i = 1; i < 16; i++) {
            address slot = _trackerStateSocket().get(i);
            bool hasDuplicate = slot == token;
            bool hasNotFoundEmptySlotAndSlotIsEmpty = emptySlot == 128 && slot == address(0);
            if (hasDuplicate) {
                revert TrackerImplementation__DuplicateFound();
            }
            if (hasNotFoundEmptySlotAndSlotIsEmpty) {
                emptySlot = i;
            }
        }
        bool hasNotFoundEmptySlot = emptySlot == 128;
        if (hasNotFoundEmptySlot) {
            revert TrackerImplementation__NoEmptySlots();
        }
        _trackerStateSocket().set(emptySlot, token);
        return true;
    } 

    function _trackerImplementation__stopTrackingToken(address token) internal virtual returns (bool) {
        for (uint8 i = 1; i < 16; i++) {
            address slot = _trackerStateSocket().get(i);
            bool match = slot == token;
            if (match) {
                _trackerStateSocket().set(i, address(0));
                return true;
            }
        }
        revert TrackerImplementation__TokenNotFound();
    }
}