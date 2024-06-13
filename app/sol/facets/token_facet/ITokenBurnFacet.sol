// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface ITokenBurnFacet {
    function burn(address account, uint256 amount) external returns (bool);
}