// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

struct ERC20 {
    string name;
    string symbol;
    uint256 totalSupply;
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowances;
}

contract ERC20Slot {
    bytes32 constant internal _ERC20_SLOT = bytes32(uint256(keccak256("eip1967.token")) - 1);

    function _ERC20Slot() internal pure returns (ERC20 storage sl) {
        bytes32 loc = _ERC20_SLOT;
        assembly {
            sl.slot := loc
        }
    }
}