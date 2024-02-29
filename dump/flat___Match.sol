
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\__Match.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity 0.8.19;

library __Match {

    function isSameString(string memory stringA, string memory stringB) public pure returns (bool) {
        
        return keccak256(abi.encode(stringA)) == keccak256(abi.encode(stringB));
    }
}
