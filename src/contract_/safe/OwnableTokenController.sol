// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IOwnableTokenController} from "./IOwnableTokenController.sol";
import {IOwnableToken} from "../asset/token/ownable/IOwnableToken.sol";

abstract contract OwnableTokenController is IOwnableTokenController {
    IOwnableToken private _ownableToken;

    constructor() {}

    function controlledToken() public view returns (IOwnableToken) {
        return _ownableToken;
    }

    function name() public view returns (string memory) {
        return _ownableToken.name();
    }

    function symbol() public view returns (string memory) {
        return _ownableToken.symbol();
    }

    function decimals() public view returns (uint8) {
        return _ownableToken.decimals();
    }

    function totalSupply() public view returns (uint256) {
        return _ownableToken.totalSupply();
    }

    function balanceOf(address account) public view returns (uint256) {
        return _ownableToken.balanceOf(account);
    }

    function allowance(address account, address spender) public view returns (uint256) {
        return _ownableToken.allowance(account, spender);
    }

    function _mint(address account, uint256 amount) internal {
        return _ownableToken.mint(account, amount);
    }

    function _burn(address account, uint256 amount) internal {
        return _ownableToken.burn(account, amount);
    }
}