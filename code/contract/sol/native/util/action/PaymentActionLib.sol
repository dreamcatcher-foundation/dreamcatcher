// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../adaptor/TokenAddressAdaptorLib.sol";

library PaymentActionLib {
    using PaymentActionLib for address;
    using TokenAddressAdaptorLib for address;

    function requestToken(address token, address from, uint256 amountR64) internal returns (bool) {
        return token.transferFromR64(from, address(this), amountR64);
    }

    function requestToken(address token, uint256 amountR64) internal returns (bool) {
        return token.requestToken(msg.sender, amountR64);
    }

    function requestTokens(address[] memory tokens, address[] memory sources, uint256[] memory amountsR64) internal returns (bool) {
        require(tokens.length == sources.length && sources.length == amountsR64.length && amountsR64.length == tokens.length, "PaymentActionLib: tokens.length != sources.length != amountsR64.length");
        for (uint256 i = 0; i < tokens.length; i++) {
            tokens[i].requestToken(sources[i], amountsR64[i]);
        }
        return true;
    }

    function requestTokens(address[] memory tokens, uint256[] memory amountsR64) internal returns (bool) {
        require(tokens.length == amountsR64.length, "PaymentActionLib: tokens.length != amountsR64.length");
        for (uint256 i = 0; i < tokens.length; i++) {
            tokens[i].requestToken(amountsR64[i]);
        }
        return true;
    }

    function deliverToken(address token, address to, uint256 amountR64) internal returns (bool) {
        return token.transferR64(to, amountR64);
    }

    function deliverToken(address token, uint256 amountR64) internal returns (bool) {
        return token.deliverToken(msg.sender, amountR64);
    }

    function deliverTokens(address[] memory tokens, address[] memory recipients, uint256[] memory amountsR64) internal returns (bool) {
        require(tokens.length == recipients.length && recipients.length == amountsR64.length && amountsR64.length == tokens.length, "PaymentActionLib: tokens.length != recipients.length != amountsR64.length");
        for (uint256 i = 0; i < tokens.length; i++) {
            tokens[i].deliverToken(recipients[i], amountsR64[i]);
        }
        return true;
    }

    function deliverTokens(address[] memory tokens, uint256[] memory amountsR64) internal returns (bool) {
        require(tokens.length == amountsR64.length, "PaymentActionLib: tokens.length != amountsR64.length");
        for (uint256 i = 0; i < tokens.length; i++) {
            tokens[i].deliverToken(amountsR64[i]);
        }
        return true;
    }
}