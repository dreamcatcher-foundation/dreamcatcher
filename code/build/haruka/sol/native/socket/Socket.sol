// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

contract Socket {
    bytes32 constant internal _SOCKET = bytes32(uint256(keccak256("eip1967.socket")) - 1);

    function _socket() internal pure returns (mapping(string => address) storage sl) {
        bytes32 loc = _SOCKET;
        assembly {
            sl.slot := loc
        }
    }
}