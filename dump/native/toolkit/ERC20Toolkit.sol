// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

function _getNameUsingERC20Toolkit(address token) view returns (string memory) {
    return IERC20Metadata(token).name();
}

function _getSymbolUsingERC20Toolkit(address token) view returns (string memory) {
    return IERC20Metadata(token).symbol();
}

function _getDecimalsUsingERC20Toolkit(address token) view returns (uint8) {
    return IERC20Metadata(token).decimals();
}

function _getTotalSupplyUsingERC20Toolkit(address token) view returns (uint256) {
    return IERC20(token).totalSupply();
}

function _getBalanceOfUsingERC20Toolkit(address token, address account) view returns (uint256) {
    return IERC20(token).balanceOf(account);
}

function _getAllowanceUsingERC20Toolkit(address token, address owner, address spender) view returns (uint256) {
    return IERC20(token).allowance(owner, spender);
}

function _transferUsingERC20Toolkit(address token, address to, uint256 amount) returns (bool) {
    IERC20(token).transfer(to, amount);
    return true;
}

function _transferFromUsingERC20Toolkit(address token, address from, address to, uint256 amount) returns (bool) {
    IERC20(token).transferFrom(from, to, amount);
    return true;
}

function _approveUsingERC20Toolkit(address token, address spender, uint256 amount) returns (bool) {
    IERC20(token).approve(spender, amount);
    return true;
}