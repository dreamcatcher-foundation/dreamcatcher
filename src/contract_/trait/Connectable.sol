// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

abstract contract KernelPort {
    
}



abstract contract Connectable {
    event Connect(string indexed port, address oldImplementation, address newImplementation);
    event Disconnect(string indexed socket);
    error MissingDependency(string port, string message);
    error IllegalImplementation(string port, string message);
    
    mapping(string => address) private _dependencies;

    function _use(string memory socket) internal view returns (address) {
        if (_dependencies[socket] == 0x0000000000000000000000000000000000000000) revert MissingDependency(socket, "port is missing a dependency");
        return _dependencies[socket];
    }

    function _connect(string memory socket, address implementation) internal {
        if (implementation == 0x0000000000000000000000000000000000000000) revert IllegalImplementation(socket, "cannot connect to 0x0000000000000000000000000000000000000000");
        address oldImplementation = _use(socket);
        address newImplementation = implementation;
        _dependencies[socket] = implementation;
        emit Connect(socket, oldImplementation, newImplementation);
        return;
    }

    function _disconnect(string memory socket) internal {
        _dependencies[socket] = 0x0000000000000000000000000000000000000000;
        emit Disconnect(socket);
        return;
    }
}