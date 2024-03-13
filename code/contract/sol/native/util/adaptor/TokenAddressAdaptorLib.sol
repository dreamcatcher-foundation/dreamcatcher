// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../../../non-native/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import "../../../non-native/openzeppelin/token/ERC20/IERC20.sol";
import "../math/UintConversionMathLib.sol";

library TokenAddressAdaptorLib {
    using TokenAddressAdaptorLib for address;
    using UintConversionMathLib for uint256;

    function asNativeDecimalRepresentation(address token, uint256 valueR) internal view returns (uint256 r64) {
        return valueR.asR64(IERC20Metadata(token).decimals());
    }

    function asNonNativeDecimalRepresentation(address token, uint256 valueR64) internal view returns (uint256 r) {
        return valueR64.asR(IERC20Metadata(token).decimals());
    }

    function totalSupplyR64(address token) internal view returns (uint256 r64) {
        return token.asNativeDecimalRepresentation(IERC20(token).totalSupply());
    }

    function balanceOfR64(address token, address account) internal view returns (uint256 r64) {
        return token.asNativeDecimalRepresentation(IERC20(token).balanceOf(account));
    }

    function balanceOfR64(address token) internal view returns (uint256 r64) {
        return token.asNativeDecimalRepresentation(IERC20(token).balanceOf(msg.sender));
    }

    function balanceR64(address token) internal view returns (uint256 r64) {
        return token.balanceOfR64(address(this));
    }

    function allowanceR64(address token, address owner, address spender) internal view returns (uint256 r64) {
        return token.asNativeDecimalRepresentation(IERC20(token).allowance(owner, spender));
    }

    function transferR64(address token, address to, uint256 amountR64) internal returns (bool) {
        return IERC20(token).transfer(to, token.asNonNativeDecimalRepresentation(amountR64));
    }

    function transferFromR64(address token, address from, address to, uint256 amountR64) internal returns (bool) {
        return IERC20(token).transferFrom(from, to, token.asNonNativeDecimalRepresentation(amountR64));
    }

    function approveR64(address token, address spender, uint256 amountR64) internal returns (bool) {
        return IERC20(token).approve(spender, token.asNonNativeDecimalRepresentation(amountR64));
    }
}