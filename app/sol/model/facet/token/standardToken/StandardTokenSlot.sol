// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct StandardTokenSlotStorageLayout {
    string symbol;
    uint256 totalSupply;
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowances;
}

contract StandardTokenSlot {
    bytes32 constant internal _STANDARD_TOKEN_SLOT = bytes32(uint256(keccak256("eip1967.standardToken")) - 1);

    function _standardTokenSlot() internal pure returns (StandardTokenSlotStorageLayout storage storageLayout) {
        bytes32 slot = _STANDARD_TOKEN_SLOT;
        assembly {
            storageLayout.slot := slot
        }
    }
}