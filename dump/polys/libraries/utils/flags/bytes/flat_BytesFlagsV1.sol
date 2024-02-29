
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\polys\libraries\utils\flags\bytes\BytesFlagsV1.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.19;
////import "contracts/polygon/libraries/errors/ErrorsV1.sol";

library BytesFlagsV1 {

    function onlynotMatchingValue(bytes memory self, bytes memory value) public pure returns (bytes memory) {
        if (keccak256(self) == keccak256(value)) { revert ErrorsV1.IsMatchingValue(); }
        return self;
    }
}
