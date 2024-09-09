// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

abstract contract KernelPortsX8 {
    event Install(bytes32 indexed port, address implementation);
    event Uninstall(bytes32 indexed port);

    uint8 private _PORTS_COUNT = 8;

    mapping(bytes32 => address) private _dependency;
    bytes32[_PORTS_COUNT] private _ports;

    modifier dependency(bytes32 port) {
        if (_zero(_dependency[port])) revert ("missing-dependency");
        
        _;
    }

    constructor() {}

    function ports() internal view returns (bytes32[] memory) {
        bytes32[] memory ports_ = new bytes32[](_ports.length);

    }


    function _tryAddPort(bytes32 port) private returns (bytes32) {
        uint8 i;
        i = 0;
        while (i < 8) {
            if (_ports[i] == port) return 0x0000000000000000000000000000000000000000;
            unchecked {
                i++;
            }
        }
        i = 0;
        while (i < 8) {
            if (_ports[i] == 0x0000000000000000000000000000000000000000) return _ports[i] = port;
            unchecked {
                i++;
            }
        }
        revert ("out-of-ports");
    }

    function _tryRemovePort(bytes32 port) private returns (bytes32) {
        for (uint8 i = 0; i < _PORTS_COUNT; i++) if (_ports[i] == port) return _ports[i] = 0x0000000000000000000000000000000000000000;
        return 0x0000000000000000000000000000000000000000;
    }


    function _install(bytes32 port, address implementation) internal {
        _tryAddPort(port);
        _dependency[port] = implementation;
        emit Install(port, implementation);
        return;
    }

    function _uninstall(bytes32 port) internal {
        _tryRemovePort(port);
        _dependency[port] = 0x0000000000000000000000000000000000000000;
        emit Uninstall(port);
        return;
    }

    function _use(bytes32 port) internal view dependency(port) returns (address) {
        return _dependency[port];
    }

    function _zero(address x) private pure returns (bool) {
        return x == _0();
    }

    function _zero(bytes32 x) private pure returns (bool) {
        return x == _0();
    }

    function _0() private pure returns (address) {
        return 0x0000000000000000000000000000000000000000;
    }
    
    function _0() private pure returns (bytes32) {
        return 0x0000000000000000000000000000000000000000;
    }
}