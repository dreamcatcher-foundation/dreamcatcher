// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../../non-native/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import "../../non-native/openzeppelin/token/ERC20/IERC20.sol";
import "../math/UintConversionMathLib.sol";

library TokenAddressAdaptorLib {
    using TokenAddressAdaptorLib for address;
    using UintConversionMathLib for uint;

    /**
     * @dev Converts a value from the non-native representation of its token to the Dreamcatcher native r64.
     * @param token The address of the token.
     * @param valueR The value to convert.
     * @return r64 The value converted to the Dreamcatcher native r64 representation.
     * @notice This function retrieves the number of decimals from the token contract to perform the conversion.
     */
    function asNativeDecimalRepresentation(address token, uint valueR) internal view returns (uint r64) {
        return valueR.asR64(IERC20Metadata(token).decimals());
    }

    /**
     * @dev Converts a value from the Dreamcatcher native r64 to the native representation of its token.
     * @param token The address of the token.
     * @param valueR64 The value to convert.
     * @return r The value converted to the native representation of the token.
     * @notice The native representation is generally higher than most other tokens to allow for more precise operations. Conversion may lead to loss of precision.
     */
    function asNonNativeDecimalRepresentation(address token, uint valueR64) internal view returns (uint r) {
        return valueR64.asR(IERC20Metadata(token).decimals());
    }

    /**
     * @dev Returns the total supply of the token as r64.
     * @param token The address of the token.
     * @return r64 The total supply of the token in the Dreamcatcher native r64 representation.
     */
    function totalSupplyR64(address token) internal view returns (uint r64) {
        return token.asNativeDecimalRepresentation(IERC20(token).totalSupply());
    }

    /**
     * @dev Returns the balance of an address as r64.
     * @param token The address of the token.
     * @param account The address of the account to query the balance for.
     * @return r64 The balance of the account in the Dreamcatcher native r64 representation.
     */
    function balanceOfR64(address token, address account) internal view returns (uint r64) {
        return token.asNativeDecimalRepresentation(IERC20(token).balanceOf(account));
    }

    /**
     * @dev Returns the balance of the caller as r64.
     * @param token The address of the token.
     * @return r64 The balance of the caller in the Dreamcatcher native r64 representation.
     */
    function balanceOfR64(address token) internal view returns (uint r64) {
        return token.asNativeDecimalRepresentation(IERC20(token).balanceOf(msg.sender));
    }

    /**
     * @dev Returns the balance of the contract as r64.
     * @param token The address of the token.
     * @return r64 The balance of the contract in the Dreamcatcher native r64 representation.
     */
    function balanceR64(address token) internal view returns (uint r64) {
        return token.balanceOfR64(address(this));
    }

    /**
     * @dev Returns the allowance granted to a spender by the owner in r64.
     * @param token The address of the token.
     * @param owner The address of the owner.
     * @param spender The address of the spender.
     * @return r64 The allowance in the Dreamcatcher native r64 representation.
     */
    function allowanceR64(address token, address owner, address spender) internal view returns (uint r64) {
        return token.asNativeDecimalRepresentation(IERC20(token).allowance(owner, spender));
    }

    /**
     * @dev Transfers tokens from the caller's address to a recipient in r64.
     * @param token The address of the token.
     * @param to The address of the recipient.
     * @param amountR64 The amount of tokens to transfer in the Dreamcatcher native r64 representation.
     * @return A boolean indicating whether the transfer was successful.
     */
    function transferR64(address token, address to, uint amountR64) internal returns (bool) {
        return IERC20(token).transfer(to, token.asNonNativeDecimalRepresentation(amountR64));
    }

    /**
     * @dev Transfers tokens from one address to another on behalf of the owner in r64.
     * @param token The address of the token.
     * @param from The address of the sender.
     * @param to The address of the recipient.
     * @param amountR64 The amount of tokens to transfer in the Dreamcatcher native r64 representation.
     * @return A boolean indicating whether the transfer was successful.
     */
    function transferFromR64(address token, address from, address to, uint amountR64) internal returns (bool) {
        return IERC20(token).transferFrom(from, to, token.asNonNativeDecimalRepresentation(amountR64));
    }

    /**
     * @dev Sets the allowance for a spender by the owner in r64.
     * @param token The address of the token.
     * @param spender The address of the spender.
     * @param amountR64 The allowance to set in the Dreamcatcher native r64 representation.
     * @return A boolean indicating whether the approval was successful.
     */
    function approveR64(address token, address spender, uint amountR64) internal returns (bool) {
        return IERC20(token).approve(spender, token.asNonNativeDecimalRepresentation(amountR64));
    }
}