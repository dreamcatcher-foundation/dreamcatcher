// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

abstract contract KernelExclusiveAccess {
    error KernelAccess__Unauthorized();

    modifier kernel() {
        if (msg.sender != address(this)) revert KernelAccess__Unauthorized();
        _;
    }
}