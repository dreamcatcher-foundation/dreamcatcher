// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IVaultFacet {
    function deposit() external returns (bool);
    function withdraw() external returns (bool);
    function swap() external returns (bool);
    function registerPair() external (bool);
}