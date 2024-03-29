
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\contracts\polygon\slots\roles\SyndicateSlot.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;
////import "contracts/polygon/slots/.components/RoleComponent.sol";

contract SyndicateSlot {
    bytes32 internal constant _SYNDICATE = keccak256("slot.syndicate");

    function syndicate() internal pure returns (RoleComponent.Role storage s) {
        bytes32 location = _SYNDICATE;
        assembly {
            s.slot := location
        }
    }
}
