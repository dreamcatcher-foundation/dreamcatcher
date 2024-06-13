// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IERC20Metadata } from "../../imports/openzeppelin/ERC20/extensions/IERC20Metadata.sol";
import { IERC20 } from "../../imports/openzeppelin/ERC20/IERC20.sol";

interface ITokenFacet is 
    IERC20Metadata,
    IERC20 {}