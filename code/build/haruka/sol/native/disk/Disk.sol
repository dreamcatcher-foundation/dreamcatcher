// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

contract Disk {
    event Migration(address oldImplementation, address newImplementation);

    error OnlyImplementation();

    address private _implementation;

    constructor(address implementation) {
        _implementation = implementation;
    }

    function implementation() public view virtual returns (address) {
        return _implementation;
    }

    function freeze() public virtual returns (bool) {
        _onlyImplementation();
        address oldImplementation = implementation();
        address newImplementation = address(0);
        _implementation = newImplementation;
        emit Migration(oldImplementation, newImplementation);
        return true;
    }

    function migrate(address implementation) public virtual returns (bool) {
        _onlyImplementation();
        address oldImplementation = implementation();
        address newImplementation = implementation;
        _implementation = newImplementation;
        emit Migration(oldImplementation, newImplementation);
        return true;
    } 

    function _onlyImplementation() internal view virtual returns (bool) {
        address caller = msg.sender;
        bool isImplementation = caller == implementation();
        if (!isImplementation) {
            revert OnlyImplementation();
        }
        return true;
    }
}