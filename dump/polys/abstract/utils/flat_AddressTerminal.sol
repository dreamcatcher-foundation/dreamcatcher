
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\polys\abstract\utils\AddressTerminal.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity 0.8.19;
////import "contracts/polygon/abstract/storage/Storage.sol";

abstract contract AddressTerminal is Storage {

    /**
    * @dev Returns the keccak256 hash of the string "TERMINAL".
    * This function is pure and does not modify the contract state.
    * @return bytes32 The keccak256 hash of the string "TERMINAL".
    */
    function terminalKey() public pure virtual returns (bytes32) {
        return keccak256(abi.encode("TERMINAL"));
    }

    /**
    * @dev Returns the address stored in the contract state at the key generated by `terminalKey`.
    * This function is view and does not modify the contract state.
    * @return address The address stored in the contract state at the key generated by `terminalKey`.
    */
    function terminal() public view virtual returns (address) {
        return _address[terminalKey()];
    }

    /**
    * @dev Internal function to initialize the contract with the specified `account` as the terminal address.
    * It sets the terminal address in the contract state.
    * @param account The address to be set as the terminal address.
    */
    function _initialize(address account) internal virtual {
        _setTerminal(account);
    }

    /**
    * @dev Internal function to set the terminal address in the contract state.
    * It updates the terminal address using the specified `account`.
    * @param account The address to be set as the terminal address.
    */
    function _setTerminal(address account) internal virtual {
        _address[terminalKey()] = account;
    }
}
