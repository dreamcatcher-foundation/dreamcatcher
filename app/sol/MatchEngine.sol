// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

contract MatchEngine {
    function _matchString(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(a) == keccak256(b);
    }
}