// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IERC20Metadata } from "../import/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";

library UniswapV2PathLib {
    error InvalidUniswapV2Path();

    function decimals0(address[] memory path) internal view returns (uint8) {
        onlyValidPath(path);
        return IERC20Metadata(token0(path)).decimals();
    }

    function decimals1(address[] memory path) internal view returns (uint8) {
        onlyValidPath(path);
        return IERC20Metadata(token1(path)).decimals();
    }

    function token0(address[] memory path) internal pure returns (address) {
        onlyValidPath(path);
        return path[0];
    }

    function token1(address[] memory path) internal pure returns (address) {
        onlyValidPath(path);
        return path[path.length - 1];
    }

    function onlyValidPath(address[] memory path) internal pure returns (bool) {
        if (path.length < 2) {
            revert InvalidUniswapV2Path();
        }
        return true;
    }
}