// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

contract MatchEngine {
    function _matchString(string memory str0, string memory str1) internal pure returns (bool) {
        uint256 str0Length = bytes(str0).length;
        uint256 str1Length = bytes(str1).length;
        if (str0Length != str1Length) return false;
        bool match;
        assembly {
            let len := mload(str0)
            let ptr0 := add(str0, 0x20)
            let ptr1 := add(str1, 0x20)
            match := 1
            for { let i := 0} lt(i, len) { i := add(i, 0x20) } {
                let chunk0 := mload(add(ptr0, i))
                let chunk1 := mload(add(ptr1, i))
                if iszero(eq(chunk0, chunk1)) {
                    match := 0
                    break
                }
            }
        }
        return match;
    }
}