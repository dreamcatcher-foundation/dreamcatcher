// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { VaultTokenTrackerSlot } from "./VaultTokenTrackerSlot.sol";

contract VaultTokenTrackerSdk is VaultTokenTrackerSlot {
    function _getSlotAtVaultTokenTracker(uint8 slotId) external view returns (address) {
        return _vaultTokenTrackerSlot().slots[slotId];
    }

    function _setSlotAtVault

}


