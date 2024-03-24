// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import { IERC20 } from "../../non-native/openzeppelin/token/ERC20/IERC20.sol";
import { IERC20Metadata } from "../../non-native/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { UniswapV2Oracle } from "./UniswapV2Oracle.sol";

contract UniswapV2Swapper is UniswapV2Oracle {
    error InsufficientYield(address[] path, FixedPointValue amountIn, FixedPointValue minYield);

    function _swap(address[] memory path, FixedPointValue memory amountIn, FixedPointValue memory minYield) internal only2SimilarFixedPointTypes(amountIn, minYield) returns (FixedPointValue memory) {
        if (_yield(path, amountIn).value < minYield.value) {
            revert InsufficientYield(path, amountIn, minYield);
        }
        IERC20(_token0(path)).approve(address(oracle()._router), 0);
        IERC20(_token0(path)).approve(address(oracle()._router), _asNewDecimals(amountIn, _decimals0(path)));
        uint256[] memory amounts = oracle().router_.swapExactTokensForTokens(_amountInAsDecimals0(amountIn).value, _amountOutAsDecimals1(path, amountIn).value, path, msg.sender, block.timestamp);
        uint256 amount = amounts[amounts.length - 1];
        return _asEther(FixedPointValue({value: amount, decimals: _decimals1(path)}));
    }

    function _amountInAsDecimals0(FixedPointValue memory amountIn) private view returns (FixedPointValue memory) {
        return _asNewDecimals(amountIn, _decimals0(path));
    }

    function _amountOutAsDecimals1(address[] memory path, FixedPointValue memory amountIn) private view returns (FixedPointValue memory) {
        return _asNewDecimals(_realAmountOut(path, amountIn), _decimals1(path));
    }

    function _decimals0(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (uint8) {
        return IERC20Metadata(_token0(path)).decimals();
    }

    function _decimals1(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (uint8) {
        return IERC20Metadata(_token1(path)).decimals();
    }

    function _token0(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (address) {
        return path[0];
    }

    function _token1(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (address) {
        return path[path.length - 1];
    }
}