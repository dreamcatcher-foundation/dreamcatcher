// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface ITokenSetterPlugIn {
    function setTokenSymbol(string memory symbol) external returns (bool);
}