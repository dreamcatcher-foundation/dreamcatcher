// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Quirk {
    bytes4[] private _endpoints;

    function endpoints() public view override returns (bytes4[] memory) {
        return _endpoints;
    }
}