// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../adaptor/TokenAddressAdaptorLib.sol";

library PaymentActionLib {
    using PaymentActionLib for address;
    using TokenAddressAdaptorLib for address;

    /**
     * @dev Requests tokens from a specified source address and transfers them to the contract.
     * @param token The address of the token contract.
     * @param from The address of the source from which tokens will be transferred.
     * @param amountR64 The amount of tokens to request in Dreamcatcher native r64 representation.
     * @return A boolean indicating whether the token transfer was successful.
     */
    function requestToken(address token, address from, uint amountR64) internal returns (bool) {
        return token.transferFromR64(from, address(this), amountR64);
    }

    /**
     * @dev Requests tokens from the sender and transfers them to the contract.
     * @param token The address of the token contract.
     * @param amountR64 The amount of tokens to request in Dreamcatcher native r64 representation.
     * @return A boolean indicating whether the token transfer was successful.
     */
    function requestToken(address token, uint amountR64) internal returns (bool) {
        return token.requestToken(msg.sender, amountR64);
    }

    /**
     * @dev Requests multiple tokens from specified sources and transfers them to the contract.
     * @param tokens The addresses of the token contracts.
     * @param sources The addresses of the sources from which tokens will be transferred.
     * @param amountsR64 The amounts of tokens to request in Dreamcatcher native r64 representation.
     * @return A boolean indicating whether all token transfers were successful.
     */
    function requestTokens(address[] memory tokens, address[] memory sources, uint[] memory amountsR64) internal returns (bool) {
        require(tokens.length == sources.length && sources.length == amountsR64.length && amountsR64.length == tokens.length, "PaymentActionLib: tokens.length != sources.length != amountsR64.length");
        for (uint i = 0; i < tokens.length; i++) {
            tokens[i].requestToken(sources[i], amountsR64[i]);
        }
        return true;
    }

    /**
     * @dev Requests multiple tokens from the sender and transfers them to the contract.
     * @param tokens The addresses of the token contracts.
     * @param amountsR64 The amounts of tokens to request in Dreamcatcher native r64 representation.
     * @return A boolean indicating whether all token transfers were successful.
     */
    function requestTokens(address[] memory tokens, uint[] memory amountsR64) internal returns (bool) {
        require(tokens.length == amountsR64.length, "PaymentActionLib: tokens.length != amountsR64.length");
        for (uint i = 0; i < tokens.length; i++) {
            tokens[i].requestToken(amountsR64[i]);
        }
        return true;
    }

    /**
     * @dev Delivers tokens from the contract to a specified recipient.
     * @param token The address of the token contract.
     * @param to The address of the recipient to which tokens will be transferred.
     * @param amountR64 The amount of tokens to deliver in Dreamcatcher native r64 representation.
     * @return A boolean indicating whether the token transfer was successful.
     */
    function deliverToken(address token, address to, uint amountR64) internal returns (bool) {
        return token.transferR64(to, amountR64);
    }

    /**
     * @dev Delivers tokens from the contract to the sender.
     * @param token The address of the token contract.
     * @param amountR64 The amount of tokens to deliver in Dreamcatcher native r64 representation.
     * @return A boolean indicating whether the token transfer was successful.
     */
    function deliverToken(address token, uint amountR64) internal returns (bool) {
        return token.deliverToken(msg.sender, amountR64);
    }

    /**
     * @dev Delivers multiple tokens from the contract to specified recipients.
     * @param tokens The addresses of the token contracts.
     * @param recipients The addresses of the recipients to which tokens will be transferred.
     * @param amountsR64 The amounts of tokens to deliver in Dreamcatcher native r64 representation.
     * @return A boolean indicating whether all token transfers were successful.
     */
    function deliverTokens(address[] memory tokens, address[] memory recipients, uint[] memory amountsR64) internal returns (bool) {
        require(tokens.length == recipients.length && recipients.length == amountsR64.length && amountsR64.length == tokens.length, "PaymentActionLib: tokens.length != recipients.length != amountsR64.length");
        for (uint i = 0; i < tokens.length; i++) {
            tokens[i].deliverToken(recipients[i], amountsR64[i]);
        }
        return true;
    }

    /**
     * @dev Delivers multiple tokens from the contract to the sender.
     * @param tokens The addresses of the token contracts.
     * @param amountsR64 The amounts of tokens to deliver in Dreamcatcher native r64 representation.
     * @return A boolean indicating whether all token transfers were successful.
     */
    function deliverTokens(address[] memory tokens, uint[] memory amountsR64) internal returns (bool) {
        require(tokens.length == amountsR64.length, "PaymentActionLib: tokens.length != amountsR64.length");
        for (uint i = 0; i < tokens.length; i++) {
            tokens[i].deliverToken(amountsR64[i]);
        }
        return true;
    }
}