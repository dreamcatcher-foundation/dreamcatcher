// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

contract ERC20BasePort {
    event Approval(address indexed owner, address indexed spender, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);

    error InsufficientBalance(address account, uint256 amount);
}