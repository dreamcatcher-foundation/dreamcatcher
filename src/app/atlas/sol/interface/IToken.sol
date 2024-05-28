// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "../import/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import "../import/openzeppelin/token/ERC20/IERC20.sol";

interface IToken is IERC20Metadata, IERC20 {}