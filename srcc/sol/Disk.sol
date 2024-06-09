// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IDisk } from "./IDisk.sol";

abstract contract Disk is IDisk {
    error Unauthorized(address implementation, address caller);

    address private _implementation;

    modifier onlyImplementation() {
        _onlyImplementation();
        _;
    }

    constructor() {
        _implementation = msg.sender;
    }

    function implementation() public view virtual returns (address) {
        return _implementation;
    }

    function migrate(address implementation) external virtual onlyImplementation() returns (bool) {
        return _migrate(implementation);
    }

    function freeze() external virtual onlyImplementation() returns (bool) {
        return _freeze();
    }

    function _onlyImplementation() internal view virtual returns (bool) {
        if (implementation() != msg.sender) {
            revert Unauthorized(implementation(), msg.sender);
        }
        return true;
    }

    function _freeze() internal virtual returns (bool) {
        _migrate(address(0));
        return true;
    }

    function _migrate(address implementation) internal virtual returns (bool) {
        _implementation = implementation;
        emit Migration(implementation);
        return true;
    }
}