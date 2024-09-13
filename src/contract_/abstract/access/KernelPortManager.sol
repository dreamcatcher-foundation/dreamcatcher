// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct Port {
    address implementation;
    string key;
}

library PortImpl {
    using PortEngine for Port;

    event Connect(string indexed key, address oldImplementation, address newImplementation);
    event Disconnect();

    function use(Port memory port) internal pure returns (address) {
        if (port.implementation == 0x0000000000000000000000000000000000000000) revert ("MISSING_DEPENDENCY");
        return port.implementation;
    }

    function connect(Port storage port, address implementation) internal {
        if (port.implementation == 0x0000000000000000000000000000000000000000) revert ("VOID_IMPLEMENTATION");
        address oldImplementation = port.use();
        address newImplementation = implementation;
        port.implementation = implementation;
        emit Connect(port.key, oldImplementation, newImplementation);
        return;
    }

    function disconnect(Port storage port) internal {
        port.implementation = 0x0000000000000000000000000000000000000000;
        emit Disconnect();
        return;
    }
}

contract X {
    using PortImpl for Port;

    Port private _fpe;

    function x() internal {
        _fpe.connect(0x0000000000000000000000000000000000000000);
        _fpe.use();
        _fpe.disconnect();
        _fpe.key
    }
}