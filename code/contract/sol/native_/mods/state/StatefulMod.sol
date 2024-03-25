// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IStateMod {
    event Migration(address implementation);

    function implementation() external view returns (address);
    function migrate(address implementation) external returns (bool);
    function freeze() external returns (bool);
}

abstract contract StateMod is IStateMod {
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

    function _onlyImplementation() internal view virtual {
        if (implementation() != msg.sender) {
            revert Unauthorized(implementation(), msg.sender);
        }
    }

    function _migrate(address implementation) internal virtual returns (bool) {
        _onlyImplementation();
        migrate_(implementation);
        return true;
    }

    function _freeze() internal virtual returns (bool) {
        _onlyImplementation();
        migrate_(address(0));
        return true;
    }

    function migrate_(address implementation) private returns (bool) {
        _implementation = implementation;
        emit Migration(implementation);
        return true;
    }
}