// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

abstract contract ERC4626 {
    /**
    * NOTE Address of the underlying token used for the vault.
     */
    function asset() external view returns (address);

    /**
    * NOTE Total amount of underlying assets held by the vault.
     */
    function totalAssets() external view returns (uint256);

    function deposit()
}