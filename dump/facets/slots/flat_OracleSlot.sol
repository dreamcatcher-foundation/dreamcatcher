
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\facets\slots\OracleSlot.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;
////import "contracts/polygon/diamonds/facets/components/OracleComponent.sol";

contract OracleSlot {
    bytes32 internal constant _ORACLE = keccak256("slot.oracle");
    
    function oracle() internal pure returns (OracleComponent.Oracle storage s) {
        bytes32 location = _ORACLE;
        assembly {
            s.slot := location
        }
    }
}
