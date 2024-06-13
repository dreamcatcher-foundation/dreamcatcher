// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IFacet } from "../IFacet.sol";
import { ITokenFacet } from "./ITokenFacet.sol";
import { TokenSlLib } from "./TokenSlLib.sol"
import { TokenSlot } from "./TokenSlot.sol";
import { TokenSl } from "./TokenSl.sol";

contract TokenFacet is
    IFacet,
    ITokenFacet,
    TokenSlot {
    using TokenSlLib for TokenSl;

    function name() external view returns (string memory) {
        return _tokenSl().name();
    }

    function symbol() external view returns (string memory) {
        return _tokenSl().symbol();
    }

    function totalSupply() external view returns (uint256) {
        return _tokenSl().totalSupply();
    }

    function balanceOf(address account) external view returns (uint256) {
        return _tokenSl().balanceOf(account);
    }

    function allowance(address owner, address spender) external view returns (uint256) {
        return _tokenSl().allowance(owner, spender);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        return _tokenSl().transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        return _tokenSl().transferFrom(from, to, amount);
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        return _tokenSl().approve(spender, amount);
    }

    function increaseAllowance(address spender, uint256 amount) external returns (bool) {
        return _tokenSl().increaseAllowance(spender, amount);
    }

    function decreaseAllowance(address spender, uint256 amount) external returns (bool) {
        return _tokenSl().decreaseAllowance(spender, amount);
    }
}