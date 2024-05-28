// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct TokenStorageLayout {
    string symbol;
    uint256 totalSupply;
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowances;
}

contract TokenStorageSlot {
    bytes32 constant internal _TOKEN_STORAGE_LOCATION = bytes32(
        uint256(
            keccak256(
                "eip1967.tokenStorage"
            )
        ) - 1
    );

    function _tokenStorageSlot() internal pure returns (TokenStorageLayout storage storageLayout) {
        bytes32 location = _TOKEN_STORAGE_LOCATION;
        assembly {
            storageLayout.slot := location
        }
    }
}