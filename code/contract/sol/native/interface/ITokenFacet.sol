// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./IFacet.sol";
import "../../non-native/openzeppelin/token/ERC20/IERC20.sol";

interface ITokenFacet is IFacet, IERC20 {
    function increaseAllowance(address spender, uint256 amount) external returns (bool);
    function decreaseAllowance(address spender, uint256 amount) external returns (bool);
}