// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

function codeSize(address account) view returns (uint256) {
    uint256 size;
    assembly {
        size := extcodesize(account)
    }
    return size;
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract StringCompare {

    function compareStrings(string memory str1, string memory str2) public pure returns (bool) {
        // Compare the length first
        if (bytes(str1).length != bytes(str2).length) {
            return false;
        }

        bool isEqual;
        assembly {
            // Get the length of the strings
            let len := mload(str1)
            
            // Get the memory location of the first data byte
            let ptr1 := add(str1, 0x20)
            let ptr2 := add(str2, 0x20)
            
            // Initialize the isEqual flag to true
            isEqual := 1
            
            // Loop over the string bytes
            for { let i := 0 } lt(i, len) { i := add(i, 0x20) } {
                // Load 32 bytes from each string
                let chunk1 := mload(add(ptr1, i))
                let chunk2 := mload(add(ptr2, i))
                
                // Compare the chunks
                if iszero(eq(chunk1, chunk2)) {
                    isEqual := 0
                    break
                }
            }
        }

        return isEqual;
    }
}
