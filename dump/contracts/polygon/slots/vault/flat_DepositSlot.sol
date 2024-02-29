
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\contracts\polygon\slots\vault\DepositSlot.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;
////import "contracts/polygon/slots/.components/DepositComponent.sol";

contract DepositSlot {
    bytes32 internal constant _DEPOSIT = keccak256("slot.deposit");

    function deposit() internal pure returns (DepositComponent.Deposit storage s) {
        bytes32 location = _DEPOSIT;
        assembly {
            s.slot := location
        }
    }
}
