// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

contract GenericAuthenticatorError {
    error Unauthorized(address caller, address owner);
}