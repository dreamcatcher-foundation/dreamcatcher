// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

abstract contract Kernel {
    event DependencyInstalled();
    error MissingComponent(bytes32);
    error PortClosed(bytes32);


    struct PortConfig {
        bytes32 port;
        uint256 expiryTimestamp;
        bool cannotBeChanged;
        bool cannotBeUninstalledWithoutReplacement;
        bool cannotBeEmptyAtConstruction;
        bool cannotBeClosed;
    }

    struct Component {
        bool isOpen;
        bytes32 port;
        uint256 mountTimestamp;
        uint256 lifespan;
        uint256 expiryTimestamp;
        bool canExpire;
        bool canBeUnMountedWithoutReplacement;
        bool canBeUnMounted;
        address instance;
    }

    mapping(bytes32 => Component) private _sockets;

    modifier dependency(bytes32 port) {
        if (_sockets[port].instance == 0x0000000000000000000000000000000000000000) revert MissingComponent(port);
        _;
    }

    function _dependencies() internal view returns (Component[] memory) {
        
    }

    function _openPort(PortConfig memory config) internal {

    }

    function _closePort() internal {

    }

    function _install(bytes32 port, address implementation) internal {

    }

    function _uninstall() internal {
        IControlledToken(_import(keccak256("controlled-token")));
    }

    function _rollback(uint256 version) internal {

    }

    function _rollback() internal {

    }

    function _import(bytes32 port) internal view dependency(port) returns (address) {
        return _sockets[port].instance;
    }
}