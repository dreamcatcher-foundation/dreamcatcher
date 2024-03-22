// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import { IERC20 } from "../../../non-native/openzeppelin/token/ERC20/IERC20.sol";
import { IERC20Metadata } from "../../../non-native/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { IUniswapV2Factory } from "../../../non-native/uniswap/interfaces/IUniswapV2Factory.sol";
import { IUniswapV2Router02 } from "../../../non-native/uniswap/interfaces/IUniswapV2Router02.sol";
import { IUniswapV2Pair } from "../../../non-native/uniswap/interfaces/IUniswapV2Pair.sol";
import { FixedPointValue } from "../../shared/FixedPointValue.sol";
import { IFixedPointMath } from "../math/FixedPointMath.sol";

contract UniswapV2Adaptor {
    IFixedPointMath private fixedPointMath_;
    IUniswapV2Factory private factory_;
    IUniswapV2Router02 private router_;

    constructor(address fixedPointMath, address factory, address router) {
        fixedPointMath_ = IFixedPointMath(fixedPointMath);
        factory_ = IUniswapV2Factory(factory);
        router_ = IUniswapV2Router02(router);
    }

    function fixedPointMath() public view returns (IFixedPointMath) {
        return fixedPointMath_;
    }

    function factory() public view returns (IUniswapV2Factory) {
        return factory_;
    }

    function router() public view returns (IUniswapV2Router02) {
        return router_;
    }

    function pairAddress(address token0, address token1) public view returns (address) {
        return factory_.getPair(token0, token1);
    }

    function pairInterface(address token0, address token1) public view returns (IUniswapV2Pair) {
        return IUniswapV2Pair(pairAddress(token0, token1));
    }

    function pairReserves(address token0, address token1) public view returns (uint256[] memory) {
        uint256[] memory reserves;
        reserves = new uint256[](2);
        (
            reserves[0],
            reserves[1],
        ) = pairInterface(token0, token1).getReserves();
        return reserves;
    }

    function pairIsZeroAddress(address token0, address token1) public view returns (bool) {
        return pairAddress(token0, token1) == address(0);
    }

    function pairIsSameLayoutAsGivenTokens(address token0, address token1) public view returns (bool) {
        return token0 == pairInterface(token0, token1).token0();
    }

    function price(address token0, address token1) public view returns (FixedPointValue memory) {
        uint8 decimals0;
        uint8 decimals1;
        uint256 result;
        FixedPointValue memory quote;
        decimals0 = IERC20Metadata(token0).decimals();
        decimals1 = IERC20Metadata(token1).decimals();
        if (pairIsZeroAddress(token0, token1)) return FixedPointValue({value: 0, decimals: 18});
        if (pairIsSameLayoutAsGivenTokens(token0, token1)) {
            result = router_.quote(
                10**decimals0,
                pairReserves(token0, token1)[0],
                pairReserves(token0, token1)[1]
            );
            quote = FixedPointValue({value: result, decimals: decimals1});
            quote = fixedPointMath_.asEther(quote);
            return quote;
        }
        result = router_.quote(
            10**decimals1,
            pairReserves(token0, token1)[1],
            pairReserves(token0, token1)[0]
        );
        quote = FixedPointValue({value: result, decimals: decimals1});
        quote = fixedPointMath_.asEther(quote);
        return quote;
    }

    function amountOut(address[] memory path, FixedPointValue memory amountIn) public view returns (FixedPointValue memory) {
        address token0;
        address token1;
        uint8 decimals0;
        uint8 decimals1;
        uint256[] memory amounts;
        uint256 amount;
        FixedPointValue memory amountOut;
        token0 = path[0];
        token1 = path[path.length - 1];
        decimals0 = IERC20Metadata(token0).decimals();
        decimals1 = IERC20Metadata(token1).decimals();
        amountIn = fixedPointMath_.asNewDecimals(amountIn, decimals0);
        amounts = router_.getAmountsOut(amountIn.value, path);
        amount = amounts[amounts.length - 1];
        amountOut = FixedPointValue({value: amount, decimals: decimals1});
        amountOut = fixedPointMath_.asEther(amountOut);
        return amountOut;
    }

    function yield(address[] memory path, FixedPointValue memory amountIn) public view returns (FixedPointValue memory basisPoints) {
        address token0;
        address token1;
        FixedPointValue memory bestAmountOut;
        FixedPointValue memory realAmountOut;
        FixedPointValue memory scale;
        token0 = path[0];
        token1 = path[path.length - 1];
        amountIn = fixedPointMath_.asEther(amountIn);
        bestAmountOut = fixedPointMath_.mul(amountIn, price(token0, token1));
        realAmountOut = amountOut(path, amountIn);
        if (bestAmountOut.value == 0 || realAmountOut.value == 0) return FixedPointValue({value: 0, decimals: 18});
        if (realAmountOut.value >= bestAmountOut.value) return fixedPointMath_.asEther(FixedPointValue({value: 10_000, decimals: 0}));
        scale = fixedPointMath_.scale(realAmountOut, bestAmountOut);
        return scale;
    }
}