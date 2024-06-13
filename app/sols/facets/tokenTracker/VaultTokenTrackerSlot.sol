// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct VaultTokenTrackerSlotStorageLayout {
    address[32] slots;
}

contract VaultTokenTrackerSlot {
    bytes32 constant internal _VAULT_TOKEN_TRACKER_SLOT = bytes32(uint256(keccak256("eip1976.tracker")) - 1);

    function _tokenTracker() internal pure returns (VaultTokenTrackerSlotStorageLayout storage storageLayout) {
        bytes32 slot = _VAULT_TOKEN_TRACKER_SLOT;
        assembly {
            storageLayout.slot := slot
        }
    }
}