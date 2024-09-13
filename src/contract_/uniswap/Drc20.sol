// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {EnumerableSet} from "./import/openzeppelin/utils/structs/EnumerableSet.sol";

contract Drc20 {
    EnumerableSet.AddressSet private _keys;

    mapping(address => uint256) private _balances;




    function holders() public view returns (address[] memory) {
        return EnumerableSet.values(_keys);
    }
}



function largestHolder(EnumerableSet.AddressSet storage holders) view returns (address) {

}


struct Constribution {
    uint256 mintTimestamp;
    uint256 burnTimestamp;
    uint256 amountIn;
    uint256 amountOut;
    bool complete;
}

struct QuoteRecord {
    uint256 timestamp;
    uint256 real;
    uint256 best;
    uint256 slippage;
}



library DateL {

    struct TimestampedDate {
        uint256 timestamp;
        uint256 year;
        uint256 month;
        uint256 day;
    }

    struct Date {
        uint256 year;
        uint256 month;
        uint256 day;
    }


}



contract Calender {


    function isLeapYear(uint256 year) public pure returns (bool) {
        return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
    }


    function year() public view returns (uint256) {
        return 1970 + yearsSince1970();
    }

    function yearsSince1970() public view returns (uint256) {
        return block.timestamp / 365 days;
    }


}





 
contract Kernel {
    event Mine();

    uint8 private _MAX_BLOCK_SIZE = 10;

    uint256 private _minGas;
    uint256 private _maxGas;

    Task[] private _queue;

    struct Task {
        uint256 timesstamp;
        address at;
        bytes data;
        uint256 rewards;
    }

    struct Block {
        Task[] tasks;
    }

    modifier onlyWhenQueueIsNotEmpty() {
        _;
    }

    function mine() 
        onlyWhenQueueIsNotEmpty() public {
        if (_queue.length == 0) return;
        Task storage task = _queue[0];
        for (uint i = 0; i < _queue.length; i++) if (task.rewards < _queue[i].rewards) task = _queue[i];
        (bool success, bytes memory data) = task.at.call{value: 0, gas: 5000}(task.data);

        /// ... check if there is tasks to do
        /// ... get highest paying tasks
        /// ... get a batch of tasks
        /// ... make calls
        /// ... mint reward to caller
        emit Mine();
        return;
    }

    function redeemRewards() public {

    }

    function scheduleTask(Task memory task) public {
        _queue.push(task);
    }

    function scheduleTask(Task[] memory tasks) public {
        
    }
}