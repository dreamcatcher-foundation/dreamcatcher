// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./IFacet.sol";

interface IManagerAccessFacet is IFacet {
    function enableToken(address token) external returns (bool);
    function disableToken(address token) external returns (bool);
    function buy(uint256 tokenId, uint256 amountInR64) external returns (uint256 r64);
    function sell(uint256 tokenId, uint256 amountInR64) external returns (uint256 r64);
}