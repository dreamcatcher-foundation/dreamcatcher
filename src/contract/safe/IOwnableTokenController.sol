// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IOwnableToken} from "../asset/token/ownable/IOwnableToken.sol";

interface IOwnableTokenController {
    function controlledToken() external view returns (IOwnableToken);
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address account, address spender) external view returns (uint256);
}