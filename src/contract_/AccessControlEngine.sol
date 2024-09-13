// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

abstract contract Kernel {
    event AdminGranted();

    address private _owner;

    function owner() public view returns (address) {
        return _owner;
    }

    function transferOwnership(address account) public {
        _transferOwnership(account);
        return;
    }

    function renounceOwnership() public {
        _transferOwnership(address(0));
        return;
    }

    function _transferOwnership(address account) private {
        _owner = account;
        return;
    }
}