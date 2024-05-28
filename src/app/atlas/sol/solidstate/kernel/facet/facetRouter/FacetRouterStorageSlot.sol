// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct FacetRouterStorageLayout {
    mapping(string => address[]) versions;
}

contract FacetRouterStorageSlot {
    bytes32 constant internal _FACET_ROUTER_STORAGE_LOCATION = bytes32(
        uint256(
            keccak256(
                "eip1976.facetRouterStorage"
            )
        ) - 1
    );

    function _facetRouterStorageSlot() internal pure returns (FacetRouterStorageLayout storage storageLayout) {
        bytes32 location = _FACET_ROUTER_STORAGE_LOCATION;
        assembly {
            storageLayout.slot := location
        }
    }
}