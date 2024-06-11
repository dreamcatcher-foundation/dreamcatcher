// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { VaultTokenTracker } from "./VaultTokenTracker.sol";

library VaultTokenTrackerLib {
    error HasDuplicate();
    error IsAtLimit();
    error IsEmpty();
    error TokenNotFound();
    error IsFull();

    function length(VaultTokenTracker storage vaultTokenTracker) internal view returns (uint8) {
        return vaultTokenTracker._slots.length;
    }

    function isEmpty(VaultTokenTracker storage vaultTokenTracker) internal view returns (bool) {
        for (uint8 i = 0; i < length(vaultTokenTracker); i++) {
            if (get(vaultTokenTracker, i) != address(0)) {
                return false;
            }
        }
        return true;
    }

    function isFull(VaultTokenTracker storage vaultTokenTracker) internal view returns (bool) {
        for (uint8 i = 0; i < length(vaultTokenTracker); i++) {
            if (get(vaultTokenTracker, i) == address(0)) {
                return false;
            }
        }
        return true;
    }

    function contains(VaultTokenTracker storage vaultTokenTracker, address value) internal view returns (bool) {
        for (uint8 i = 0; i < length(vaultTokenTracker); i++) {
            if (get(vaultTokenTracker, i) == value) {
                return true;
            }
        }
        return false;
    }

    function indexOf(VaultTokenTracker storage vaultTokenTracker, address token) internal view returns (uint8) {
        for (uint8 i = 0; i < length(vaultTokenTracker); i++) {
            if (get(vaultTokenTracker, i) == token) {
                return i;
            }
        }
        return 0;
    }

    function get(VaultTokenTracker storage vaultTokenTracker, uint8 slotId) internal view returns (address) {
        return vaultTokenTracker._slots[slotId];
    }

    function set(VaultTokenTracker storage vaultTokenTracker, uint8 slotId, address token) internal returns (bool) {
        return vaultTokenTracker._slots[slotId] = token;
    }

    function push(VaultTokenTracker storage vaultTokenTracker, address token) internal returns (bool) {
        if (isFull(vaultTokenTracker)) {
            revert IsFull();
        }
        if (hasToken(vaultTokenTracker, token)) {
            revert HasDuplicate();
        }
        set(vaultTokenTracker, indexOf(vaultTokenTracker, address(0)), token);
        return true;
    }

    function pop(VaultTokenTracker storage vaultTokenTracker, address token) internal returns (bool) {
        if (isEmpty(vaultTokenTracker)) {
            revert IsEmpty();
        }
        if (has)
        bool hasToken = false;
        uint8 tokenSlot = 0;
        for (uint8 i = 0; i < length(vaultTokenTracker); i++) {
            if (get(vaultTokenTracker, i) == token) {
                hasToken = true;
                tokenSlot = i;
            }
        }
        if (!hasToken) {
            revert TokenNotFound();
        }

    }
}