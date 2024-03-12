// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import '../storage/asset/TokenStorage.sol';

contract TokenFacet is TokenStorage {
    using TokenStorageLibrary for TokenStorageLibrary.Token;

    function name() external view returns (string memory) {
        return token().name();
    }

    function symbol() external view returns (string memory) {
        return token().symbol();
    }

    function decimals() external pure returns (uint8) {
        return token().decimals();
    }

    function totalSupply() external view returns (uint256) {
        return token().totalSupply();
    }

    function balanceOf(address account) external view returns (uint256) {
        return token().balanceOf(account);
    }

    function allowance(address owner, address spender) external view returns (uint256) {
        return token().allowance(owner, spender);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        token().transfer(to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        token().transferFrom(from, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        token().approve(spender, amount);
        return true;
    }

    function increaseAllowance(address spender, uint256 amount) external returns (bool) {
        token().increaseAllowance(spender, amount);
        return true;
    }

    function decreaseAllowance(address spender, uint256 amount) external returns (bool) {
        token().decreaseAllowance(spender, amount);
        return true;
    }
}