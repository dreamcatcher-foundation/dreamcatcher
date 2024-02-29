// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Joe {
    uint count = 0;

    function increase() external {
        count += 1;
    }
}