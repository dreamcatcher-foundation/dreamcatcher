// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct PlugInRouterStorageLayout {
    mapping(string => address[]) versions;
}

contract PlugInRouterStorageSlot {
    bytes32 constant internal _PLUG_IN_ROUTER_STORAGE_LOCATION = bytes32(
        uint256(
            keccak256(
                "eip1976.plugInRouterStorage"
            )
        ) - 1
    );

    function _plugInRouterStorageSlot() internal pure returns (PlugInRouterStorageLayout storage storageLayout) {
        bytes32 location = _PLUG_IN_ROUTER_STORAGE_LOCATION;
        assembly {
            storageLayout.slot := location
        }
    }
}