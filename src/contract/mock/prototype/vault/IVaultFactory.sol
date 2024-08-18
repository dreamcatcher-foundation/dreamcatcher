// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IVaultFactory {
    function deployed() external view returns (address[] memory);
    function deploy() external returns (address);
}