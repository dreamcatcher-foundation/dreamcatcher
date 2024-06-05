// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IPlugIn } from "../../../IPlugIn.sol";
import { ITokenFacet } from "./ITokenFacet.sol";
import { TokenMetadataSdk } from "./TokenMetadataSdk.sol";
import { TokenSdk } from "./TokenSdk.sol";
import { AuthSdk } from "../auth/AuthSdk.sol";

contract TokenPlugIn is
    IPlugIn,
    ITokenFacet, 
    TokenMetadataSdk, 
    TokenSdk, 
    AuthSdk {
    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](10);
        selectors[0] = bytes4(keccak256("symbol()"));
        selectors[1] = bytes4(keccak256("decimals()"));
        selectors[2] = bytes4(keccak256("totalSupply()"));
        selectors[3] = bytes4(keccak256("balanceOf(address)"));
        selectors[4] = bytes4(keccak256("allowance(address,address)"));
        selectors[5] = bytes4(keccak256("transfer(address,uint256)"));
        selectors[6] = bytes4(keccak256("transferFrom(address,address,uint256)"));
        selectors[7] = bytes4(keccak256("approve(address,uint256)"));
        selectors[8] = bytes4(keccak256("increaseAllowance(address,uint256)"));
        selectors[9] = bytes4(keccak256("decreaseAllowance(address,uint256)"));
        return selectors;
    }

    function symbol() external view returns (string memory) {
        return _symbol();
    }

    function decimals() external view returns (uint8) {
        return _decimals();
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply();
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balanceOf(account);
    }

    function allowance(address owner, address spender) external view returns (uint256) {
        return _allowance(owner, spender);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        return _transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        return _transferFrom(from, to, amount);
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        return _approve(spender, amount);
    }

    function increaseAllowance(address spender, uint256 amount) external returns (bool) {
        return _increaseAllowance(spender, amount);
    }

    function decreaseAllowance(address spender, uint256 amount) external returns (bool) {
        return _decreaseAllowance(spender, amount);
    }
}