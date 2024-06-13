// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface ITokenMintFacet {
    function tokenMintFacet__mint(address account, uint256 amount) external returns (bool);
}