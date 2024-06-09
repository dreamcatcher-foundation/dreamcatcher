// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

contract Socket {
    error SocketNotAssigned(string socket);

    bytes32 constant internal _PORT = bytes32(uint256(keccak256("eip1967.socket")) - 1);

    modifier onlyIfSocketIsInstalled(string memory socket) {
        _onlyIfSocketIsInstalled(socket);
        _;
    }

    function _socket() internal pure returns (mapping(string => address) storage storageLayout) {
        bytes32 location = _SOCKET;
        assembly {
            storageLayout.slot := location
        }
    }

    function _onlyIfSocketIsInstalled(string memory socket) internal view returns (bool) {
        if (_socket()[socket] == address(0)) {
            revert SocketNotInstalled(socket);
        }
        return true;
    }
}