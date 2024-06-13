// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IFacet } from "../IFacet.sol";
import { ITokenFacet } from "./ITokenFacet.sol";
import { TokenSlLib } from "./TokenSlLib.sol";
import { TokenSlot } from "./TokenSlot.sol";
import { TokenSl } from "./TokenSl.sol";

contract TokenFacet is
    IFacet,
    ITokenFacet,
    TokenSlot {
    using TokenSlLib for TokenSl;

    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](11);
        selectors[0] = bytes4(keccak256("name()"));
        selectors[1] = bytes4(keccak256("symbol()"));
        selectors[2] = bytes4(keccak256("decimals()"));
        selectors[3] = bytes4(keccak256("totalSupply()"));
        selectors[4] = bytes4(keccak256("balanceOf(address)"));
        selectors[5] = bytes4(keccak256("allowance(address,address)"));
        selectors[6] = bytes4(keccak256("transfer(address,uint256)"));
        selectors[7] = bytes4(keccak256("transferFrom(address,address,uint256)"));
        selectors[8] = bytes4(keccak256("approve(address,uint256)"));
        selectors[9] = bytes4(keccak256("increaseAllowance(address,uint256)"));
        selectors[10] = bytes4(keccak256("decreaseAllowance(address,uint256)"));
        return selectors;
    }

    function name() external view returns (string memory) {
        return _tokenSl().name();
    }

    function symbol() external view returns (string memory) {
        return _tokenSl().symbol();
    }

    function decimals() external pure returns (uint8) {
        return 18;
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