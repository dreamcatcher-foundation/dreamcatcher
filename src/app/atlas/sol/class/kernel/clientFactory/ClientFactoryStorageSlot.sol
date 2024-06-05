// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct ClientFactoryStorageLayout {
    mapping(string => address) deployed;
    mapping(string => address) owner;
}

contract ClientFactoryStorageSlot {
    bytes32 constant internal _CLIENT_FACTORY_STORAGE_LOCATION = bytes32(
        uint256(
            keccak256(
                "eip1976.clientFactoryStorage"
            )
        ) - 1
    );

    function _clientFactoryStorageSlot() internal pure returns (ClientFactoryStorageLayout storage storageLayout) {
        bytes32 location = _CLIENT_FACTORY_STORAGE_LOCATION;
        assembly {
            storageLayout.slot := location
        }
    }
}