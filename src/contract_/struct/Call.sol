// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct Task {
    bytes4 hash;
    uint timestamp;
    bytes selector;
    address target;
}




/// public
/// access-controlled
/// scheduled

struct Task {
    bytes4 hash;
    uint256 timestamp;
    bytes selector;
    address target;
}

/// the kernel is a layer of control over any owner of the contract and the 
/// execution of self sovreign methods. these are methods owned directly by
/// the contract itself which can only be accessed by itself. for example a method
/// to mint new tokens would typically have an access modifier but this would be
/// owned by the contract, which can enforce timelocks and other rules over that
/// method. queueing a command decoupled the effect of a call from its excution
/// time. it does not affect normal access modified functions but it is a direct
/// command to the contract to perform a call. for instance the contract may be
/// used as a key, or more.

abstract contract Timelock {

    Task[] private _$;

    function _tasks() internal view virtual returns (Task[] memory) {
        
    }

    function _tasks(uint8 i) internal view virtual returns (Task memory) {
        if (i >= _queueSize()) revert ("Kernel::INDEX_OUT_OF_BOUNDS");
        return _$[i];
    }

    function _tasks(bytes4 hash) internal view virtual returns (Task memory) {

        uint8 i;
        while (i < _$.length) {
            if (_$[i].hash == hash) return _$[i];
            unchecked {
                i++;
            }
        }
        revert ("Kernel::TASK_NOT_FOUND");
    }

    function _scheduleTask(Task memory task) internal {
        /// limited to the amount of space left in the queue.
    }

    function _queueSize() internal pure returns (uint8) {
        return 16;
    }
}




contract Kssernel {

    /// the kernel mechanism allows for reentrant calls from task execution.
    /// c -> c 
    ///         -> x
    /// the reentrant call is ok because functions cannot be called more than once
    /// so the call starts and then the method of choice is called, then a lock is
    /// started for that particular function and therefore cannot be called again
    ///
    /// a second function can still be called however, but the method on the contract again
    ///
    /// c -> c -> c -> c -> x
    
    uint8 private _reentrant;

    /// only accessible through timelock mechanism
    modifier locked() {
        if (msg.sender != address(this)) revert ();
        if (_reentrant) revert ();
        _reentrant = 1;
        _;
        _reentrant = 0;
    }

    /// can be called directly by the owner or through a schedules task.
    modifier ownable() {
        if (
            msg.sender != address(this) ||
            msg.sender != owner
        ) revert ();
        _;
    }

    bytes[] private _queue;

    function x() onlySelf() external {
        
    }

    function y() onlySelf() external {

    }

    function _queuedTasks() internal view returns (Task[] memory) {}

    function _queuedCalls() internal view returns (Call[] memory) {}

    function _schedule(Task memory task) internal {
        if (_queue.length >= _size()) revert ("Kernel: QUEUE_SIZE_LIMIT_REACHED");
        abi.encode(Type.TASK, task);
    }

    function _schedule(Call memory call) internal {
        abi.encode(Type.CALL, call);
    }

    function _mine() internal returns (bytes memory) {
        bytes memory task = _next();


        (address target, bytes memory data, uint256 timestamp) = abi.decode(task, (address, bytes, uint256));
        (bool success, bytes memory response) = target.call(data);
        return response;
    }

    function _mine(uint8 i) internal {

    }

    function _mine(bytes4 hash) internal {

    }

    function _next() private returns (bytes memory) {
        bytes memory task = _tasks[0];
        uint256 i;
        while (i < _tasks.length - 1) {
            _tasks[i] = _tasks[i + 1];
            unchecked {
                i += 1;
            }
        }
        _tasks.pop();
        return task;
    }

    function _size() private pure returns (uint8) {
        return 16;
    }
}



contract Ownable {

}




/// kernel offers a thorough base implementation.
contract Kernel is Ownable, Timelock {}




/// no timelock
contract KernelLite {}