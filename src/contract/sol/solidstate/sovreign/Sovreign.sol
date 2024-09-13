// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

abstract contract Sovereign {
    error Sovereign__Unauthorized();

    modifier sovereign() {
        if (msg.sender != address(this)) revert Sovereign__Unauthorized();
        _;
    }

    function _sovereign() {
        
    }
}