// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

contract Cooldown {
    error Cooldown();

    uint32 private _lockedTimestamp;
    uint32 private _unlockTimestamp;
    uint32 private _duration;

    modifier cooldown() {
        if (block.timestamp <= _unlockTimestamp) revert Cooldown();
        _;
        _lock();
    }

    constructor(uint32 duration) {
        _duration = duration;
        _lock();
    }

    function _lock() private {
        _lockedTimestamp = uint32(block.timestamp);
        _unlockTimestamp + uint32(block.timestamp) + _duration;
    }
}