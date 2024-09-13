// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct Task {
    bytes32 hash;
    uint64 unlockTimestamp;
    bytes selector;
    address target;
}

abstract contract TaskArray {
    error TaskArray__NoEligibleTask();

    mapping(uint8 => Task) private _taskHashMap;

    function _task(bytes32 hash) internal view returns (Task memory) {
        for (uint8 i = 0; i < type(uint8).max; i++) if (_taskHashMap[i].hash == hash) return _taskHashMap[i];
        revert TaskArray__NoEligibleTask();
    }

    function _task(string memory key) internal view returns (Task memory) {
        return _task(keccak256(abi.encodePacked(key)));
    }
}