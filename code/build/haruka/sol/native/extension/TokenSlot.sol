// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

struct Token {
    string _name;
    string _symbol;
    uint256 _totalSupply;
    mapping(address => uint256) _balances;
    mapping(address => mapping(address => uint256)) _allowances;
}

contract TokenSlot {
    bytes32 constant internal _TOKEN = bytes32(uint256(keccak256("eip1967.token")) - 1);

    function _token() internal pure returns (Token storage sl) {
        bytes32 loc = _TOKEN;
        assembly {
            sl.slot := loc
        }
    }
}