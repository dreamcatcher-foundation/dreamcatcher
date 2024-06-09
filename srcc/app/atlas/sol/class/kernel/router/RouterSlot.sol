// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

contract RouterSlot {
    bytes32 constant internal _ROUTER_SLOT = bytes32(
        uint256(
            keccak256(
                "eip1976.router"
            )
        ) - 1
    );

    function _versions() internal pure returns (mapping(string => address[]) storage storageLayout) {
        bytes32 location = _ROUTER_SLOT;
        assembly {
            storageLayout.slot := location
        }
    }
}