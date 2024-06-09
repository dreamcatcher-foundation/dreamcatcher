// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct TokenSlotStorageLayout {
    string symbol;
    uint256 totalSupply;
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowances;
}

contract TokenSlot {
    bytes32 constant internal _TOKEN_SLOT = bytes32(
        uint256(
            keccak256(
                "eip1967.token"
            )
        ) - 1
    );

    function _token() internal pure returns (TokenSlotStorageLayout storage storageLayout) {
        bytes32 location = _TOKEN_SLOT;
        assembly {
            storageLayout.slot := location
        }
    }
}