// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct Task {
    bytes32 hash;
    uint64 unlockTimestamp;
    bytes selector;
    address target;
}

library TaskImpl {
    using TaskImpl for Task;
    event Task__Executed(Task task);
    error Task__Locked(Task task);
    error Task__ExecutionReverted(Task task);

    function is_(Task memory task, string memory name) internal pure returns (bool) {
        return keccak256(abi.encodePacked(name)) == task.hash;
    }

    function locked(Task memory task) internal view returns (bool) {
        return !task.unlocked();
    }

    function unlocked(Task memory task) internal view returns (bool) {
        return block.timestamp >= task.unlockTimestamp;
    }

    function secondsLeftToUnlock(Task memory task) internal view returns (uint64) {
        return
            task.unlocked() ? 0 :
            task.unlockTimestamp - uint64(block.timestamp);
    }

    function execute(Task memory task) internal {
        if (task.locked()) revert Task__Locked(task);
        (bool success, ) = task.target.call(task.selector);
        if (!success) revert Task__ExecutionReverted(task);
        emit Task__Executed(task);
        return;
    }
}