// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IERC20Metadata } from "../../imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";

library UniswapV2PathLibrary {
    error InvalidUniswapV2Path();

    function firstToken(address[] memory path) internal pure returns (address) {
        validate(path);
        return path[0];
    }

    function lastToken(address[] memory path) internal pure returns (address) {
        validate(path);
        return path[path.length - 1];
    }

    function validate(address[] memory path) internal pure returns (bool) {
        if (path.length < 2) {
            revert InvalidUniswapV2Path();
        }
        return true;
    }

    function firstTokenDecimals(address[] memory path) internal view returns (uint8) {
        validate(path);
        return IERC20Metadata(firstToken(path)).decimals();
    }

    function lastTokenDecimals(address[] memory path) internal view returns (uint8) {
        validate(path);
        return IERC20Metadata(lastToken(path)).decimals();
    }
}