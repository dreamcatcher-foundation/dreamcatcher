
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\facets\slots\ManagersSlot.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;
////import "contracts/polygon/diamonds/facets/components/RoleComponent.sol";

contract ManagersSlot {
    bytes32 internal constant _MANAGERS = keccak256("slot.managers");

    function managers() internal pure returns (RoleComponent.Role storage s) {
        bytes32 location = _MANAGERS;
        assembly {
            s.slot := location
        }
    }
}
