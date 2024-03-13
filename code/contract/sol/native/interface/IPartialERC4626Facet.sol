// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./IFacet.sol";

interface IPartialERC4626Facet is IFacet {
    function totalAssets() external view returns (uint256 r64);
    function realTotalAssets() external view returns (uint256 r64);
    function convertToShares(uint256 assetsInR64) external view returns (uint256 r64);
    function convertToAssets(uint256 sharesInR64) external view returns (uint256 r64);
    function deposit(uint256 assetsInR64) external returns (uint256 r64);
    function redeem(uint256 sharesInR64) external returns (bool);
}