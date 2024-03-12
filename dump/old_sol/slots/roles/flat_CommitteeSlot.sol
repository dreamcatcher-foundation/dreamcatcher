
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\code\contract\sol\slot\roles\CommitteeSlot.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;
////import "contracts/polygon/slots/.components/RoleComponent.sol";

contract CommitteeSlot {
    bytes32 internal constant _COMMITTEE = keccak256("slot.committee");

    function committee() internal pure returns (RoleComponent.Role storage s) {
        bytes32 location = _COMMITTEE;
        assembly {
            s.slot := location
        }
    }
}
