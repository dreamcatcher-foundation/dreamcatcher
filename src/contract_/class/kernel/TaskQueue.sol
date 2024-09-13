// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {Task} from "./Task.sol";
import {TaskImpl} from "./Task.sol";

struct TaskQueue {
    Task[] inner;
}

library TaskQueueImpl {
    using TaskImpl for Task;
    using TaskQueueImpl for TaskQueue;
    event TaskQueue__TaskScheduled(TaskQueue queue, Task task);
    event TaskQueue__TaskCancelled(TaskQueue queue, Task task);
    error TaskQueue__DuplicateTaskHash(TaskQueue queue, Task task);
    error TaskQueue__CannotScheduleTaskUnlockTimestampBeforeCurrentTime(TaskQueue queue, Task task);
    error TaskQueue__Empty(TaskQueue queue);
    error TaskQueue__NoEligibleTask(TaskQueue queue);

    function has(TaskQueue memory queue, string memory name) internal pure returns (bool) {
        for (uint256 i = 0; i < queue.inner.length; i++) if (queue.inner[i].is_(name)) return true;
        return false;
    }

    function has(TaskQueue memory queue, bytes32 hash) internal pure returns (bool) {
        for (uint256 i = 0; i < queue.inner.length; i++) if (queue.inner[i].hash == hash) return true;
        return false;
    }

    function has(TaskQueue memory queue, Task memory task) internal pure returns (bool) {
        return queue.has(task.hash);
    }

    function schedule(TaskQueue storage queue, Task memory task) internal {
        if (queue.has(task)) revert TaskQueue__DuplicateTaskHash(queue, task);
        if (task.unlockTimestamp < block.timestamp) revert TaskQueue__CannotScheduleTaskUnlockTimestampBeforeCurrentTime(queue, task);
        queue.inner.push(task);
        emit TaskQueue__TaskScheduled(queue, task);
        return;
    }

    function cancel(TaskQueue storage queue, string memory name) internal {
        if (queue.inner.length == 0) revert TaskQueue__Empty(queue);
        if (!queue.has(name)) revert TaskQueue__NoEligibleTask(queue);
        for (uint256 i = 0; i < queue.inner.length; i++) if (queue.inner[i].is_(name)) {
            for (uint256 j = i; j < queue.inner.length - 1; j++) queue.inner[j] = queue.inner[j + 1];
            queue.inner.pop();
            emit TaskQueue__TaskCancelled(queue, queue.inner[i]);
            return;
        }
        revert TaskQueue__NoEligibleTask(queue);
    }

    function cancel(TaskQueue storage queue, bytes32 hash) internal {
        if (queue.inner.length == 0) revert TaskQueue__Empty(queue);
        if (!queue.has(hash)) revert TaskQueue__NoEligibleTask(queue);
        for (uint256 i = 0; i < queue.inner.length; i++) if (queue.inner[i].hash == hash) {
            for (uint256 j = i; j < queue.inner.length - 1; j++) queue.inner[j] = queue.inner[j + 1];
            queue.inner.pop();
            emit TaskQueue__TaskCancelled(queue, queue.inner[i]);
            return;
        }
        revert TaskQueue__NoEligibleTask(queue);
    }

    function next(TaskQueue storage queue) internal {
        if (queue.inner.length == 0) revert TaskQueue__Empty(queue);
        for (uint256 i = 0; i < queue.inner.length; i++) if (queue.inner[i].unlocked()) {
            Task memory task = queue.inner[i];
            for (uint256 j = i; j < queue.inner.length - 1; j++) queue.inner[j] = queue.inner[j + 1];
            queue.inner.pop();
            task.execute();
            return;
        }
        revert TaskQueue__NoEligibleTask(queue);
    }

    function next(TaskQueue storage queue, string memory name) internal {
        if (queue.inner.length == 0) revert TaskQueue__Empty(queue);
        for (uint256 i = 0; i < queue.inner.length; i++) if (queue.inner[i].unlocked()) if (queue.inner[i].is_(name)) {
            Task memory task = queue.inner[i];
            for (uint256 j = i; j < queue.inner.length - 1; j++) queue.inner[j] = queue.inner[j + 1];
            queue.inner.pop();
            task.execute();
            return;
        }
        revert TaskQueue__NoEligibleTask(queue);
    }

    function next(TaskQueue storage queue, bytes32 hash) internal {
        if (queue.inner.length == 0) revert TaskQueue__Empty(queue);
        for (uint256 i = 0; i < queue.inner.length; i++) if (queue.inner[i].unlocked()) if (queue.inner[i].hash == hash) {
            Task memory task = queue.inner[i];
            for (uint256 j = i; j < queue.inner.length - 1; j++) queue.inner[j] = queue.inner[j + 1];
            queue.inner.pop();
            task.execute();
            return;
        }
        revert TaskQueue__NoEligibleTask(queue);
    }
}