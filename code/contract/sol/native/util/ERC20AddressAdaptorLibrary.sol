// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import '../../non-native/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol';
import '../../non-native/openzeppelin/token/ERC20/IERC20.sol';
import './ConversionLibrary.sol';

library ERC20AddressAdaptorLibrary {
    using ConversionLibrary for uint256;

    function name(address erc20) internal view returns (string memory) {
        return IERC20Metadata(erc20).name();
    }

    function symbol(address erc20) internal view returns (string memory) {
        return IERC20Metadata(erc20).symbol();
    }

    function decimals(address erc20) internal view returns (uint8) {
        return IERC20Metadata(erc20).decimals();
    }

    function totalSupply(address erc20) internal view returns (uint256 asNative) {
        return _asNative(erc20, IERC20(erc20).totalSupply());
    }

    function balanceOf(address erc20, address account) internal view returns (uint256 asNative) {
        return _asNative(erc20, IERC20(erc20).balanceOf(account));
    }

    function balance(address erc20) internal view returns (uint256 asNative) {
        return balanceOf(erc20, address(this));
    }

    function allowance(address erc20, address owner, address spender) internal view returns (uint256 asNative) {
        return _asNative(erc20, IERC20(erc20).allowance(owner, spender));
    }

    function transfer(address erc20, address to, uint256 amountAsNative) internal returns (bool) {
        return IERC20(erc20).transfer(to, _asNonNative(erc20, amountAsNative));
    }

    function tranferFrom(address erc20, address from, address to, uint256 amountAsNative) internal returns (bool) {
        return IERC20(erc20).transferFrom(from, to, _asNonNative(erc20, amountAsNative));
    }

    function approve(address erc20, address spender, uint256 amountAsNative) internal returns (bool) {
        return IERC20(erc20).approve(spender, _asNonNative(erc20, amountAsNative));
    }

    function _asNative(address erc20, uint256 value) private returns (uint256 asNative) {
        return value.asNative(value, decimals(erc20));
    }

    function _asNonNative(address erc20, uint256 valueAsNative) private returns (uint256 asNonNative) {
        return valueAsNative.asNonNative(decimals(erc20));
    }
}