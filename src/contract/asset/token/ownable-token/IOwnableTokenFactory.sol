// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IOwnableTokenFactory {
    function deploy(string memory name, string memory symbol, address owner) external returns (address);
}