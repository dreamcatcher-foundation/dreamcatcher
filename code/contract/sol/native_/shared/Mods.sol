// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

contract Mods {
    bytes32 constant internal _MODS = bytes32(uint256(keccak256("eip1967.mods")) - 1);

    function mods() internal pure returns (mapping(bytes32 => address) storage sl) {
        bytes32 loc = _MODS;
        assembly {
            sl.slot := loc
        }
    }
}