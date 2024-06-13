// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct PairTrackerStorageLayout {
    address token0;
    address token1;
}

contract PairTrackerSlot {
    bytes32 constant internal _PAIR_TRACKER_SLOT = bytes32(uint256(keccak256("eip1967.pairTracker")) - 1);

    function _pairTrackerSlot() {

    }
}