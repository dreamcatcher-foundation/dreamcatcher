// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

abstract contract StringEngine {

    function _isEmpty(string memory x) internal pure returns (bool) {
        string memory y;
        
        return _isMatch(x, y);
    }

    function _isMatch(string memory x, string memory y) internal pure returns (bool) {
        bytes32 string0 = keccak256(abi.encodePacked(x));
        bytes32 string1 = keccak256(abi.encodePacked(y));
        return string0 == string1;
    }
}