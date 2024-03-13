// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./IFacet.sol";

interface IRootAccessFacet is IFacet {
    function setName(string memory name) external returns (bool);
    function setSymbol(string memory symbol) external returns (bool);
    function setAsset(address token) external returns (bool);
    function setUniswapV2Factory(address uniswapV2Factory) external returns (bool);
    function setUniswapV2Router(address uniswapV2Router) external returns (bool);
    function setMaximumSlippageAsBasisPoint(uint256 maximumSlippageAsBasisPoint) external returns (bool);
    function mint(address account, uint256 amount) external returns (bool);
    function burn(address account, uint256 amount) external returns (bool);
    function grantRoleTo(string memory role, address account) external returns (bool);
    function revokeRoleFrom(string memory role, address account) external returns (bool);
    function liqLock() external returns (bool);
}