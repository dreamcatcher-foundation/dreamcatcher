// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {Task} from "./Task.sol";
import {TaskImpl} from "./Task.sol";
import {TaskQueue} from "./TaskQueue.sol";
import {TaskQueueImpl} from "./TaskQueue.sol";

struct Kernel {
    TaskQueue queue;
}

library KernelImpl {
    using TaskImpl for Task;
    using TaskQueueImpl for TaskQueue;
    using KernelImpl for Kernel;


}

contract X {
    using TaskQueueImpl for TaskQueue;

    TaskQueue private _queue;

    function _schedule() internal {
        _queue.schedule(Task({
            hash: keccak256(abi.encodePacked("set-settings")),
            unlockTimestamp: uint64(block.timestamp) + uint64(365 days),
            selector: abi.encodeWithSignature("previewMint(uint256)", 5000 ether),
            target: address(this)
        }));
        _queue.cancel(keccak256(abi.encodePacked("set-settings")));
        _queue.next();
        return;
    }
}