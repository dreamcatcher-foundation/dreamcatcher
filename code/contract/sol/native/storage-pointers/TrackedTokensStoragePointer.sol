// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

contract TrackedTokensStoragePointer {
    error TrackedTokensStoragePointer__TrackedTokensSlotsAreFull();
    error TrackedTokensStoragePointer__DuplicateFound();
    error TrackedTokensStoragePointer__TokenNotFound();

    bytes32 constant internal _slTrackedTokens = bytes32(uint256(keccak256("eip1967.slTrackedTokens")) - 1);

    function _trackedTokens() internal pure returns (address[32] storage sl) {
        bytes32 loc = _slTrackedTokens;
        assembly {
            sl.slot := loc
        }
    }

    function _startTrackingToken(address token) internal pure {
        uint8 emptySlot = 128;
        for (uint8 i = 0; i < _trackedTokens().length; i++) {
            if (_trackedTokens()[i] == token) revert TrackedTokensStoragePointer__DuplicateFound();
            if (emptySlot == 128 && _trackedTokens()[i] == address(0)) emptySlot = i;
        }
        if (emptySlot == 128) {
            revert TrackedTokensStoragePointer__TrackedTokensSlotsAreFull();
        }
        _trackedTokens()[emptySlot] = token;
        return;
    }

    function _stopTrackingToken(address token) internal pure {
        for (uint8 i = 0; i < _trackedTokens().length; i++) {
            if (_trackedTokens()[i] == token) {
                _trackedTokens()[i] = address(0);
                return;
            }
        }
        revert TrackedTokensStoragePointer__TokenNotFound();
    }
}