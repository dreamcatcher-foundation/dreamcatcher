// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import "../../../non-native/openzeppelin/token/ERC20/IERC20.sol";
import "../../../non-native/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import "../../../non-native/uniswap/interfaces/IUniswapV2Factory.sol";
import "../../../non-native/uniswap/interfaces/IUniswapV2Router02.sol";
import "../../../non-native/uniswap/interfaces/IUniswapV2Pair.sol";
import "../math/FixedPointArithmeticsMathLibrary.sol";
import "../../ImmutableLibrary.sol";

library UniswapV2AdaptorLibrary {

    /**
    * => N
     */
    function price(address token0, address token1, address factory, address router) internal view returns (uint256) {

        /**
        * NOTE This function does not revert if the pair was not found and
        *      will return 0.
         */
        if (pairIsZeroAddress(token0, token1, factory))
            return 0;

        uint8 decimals0_ = IERC20Metadata(token0).decimals();
        uint8 decimals1_ = IERC20Metadata(token1).decimals();

        /**
        * NOTE This is an edge case we don't want to deal with.
         */
        if (decimals0_ == 0 || decimals1_ == 0)
            return 0;

        if (pairIsSameLayoutAsGivenTokens(token0, token1, factory)) {
            uint256 quote_ = IUniswapV2Router02(router).quote(
                10 ** decimals0_,
                pairReserves(token0, token1, factory)[0],
                pairReserves(token0, token1, factory)[1]
            );
            return FixedPointArithmeticsMathLibrary.asNewR(quote_, decimals1_, N_());
        }
        
        uint256 quote_ = IUniswapV2Router02(router).quote(
            10 ** decimals1_,
            pairReserves(token0, token1, factory)[1],
            pairReserves(token0, token1, factory)[0]
        );
        return FixedPointArithmeticsMathLibrary.asNewR(quote_, decimals1_, N_());
    }

    /**
    * => N
     */
    function amountOut(address[] memory path, address factory, address router, uint256 amountNIn) internal view returns (uint256) {
        uint8 decimals0_ = IERC20Metadata(path[0]).decimals();
        uint8 decimals1_ = IERC20Metadata(path[path.length - 1]).decimals();

        /**
        * NOTE This is an edge case we don't want to deal with.
         */
        if (decimals0_ == 0 || decimals1_ == 0)
            return 0;

        uint256 amountRIn_ = FixedPointArithmeticsMathLibrary.asNewR(amountNIn, N_(), decimals0_);
        uint256[] memory amounts_ = IUniswapV2Router02(router).getAmountsOut(amountRIn_, path);
        uint256 amount_ = amounts_[amounts_.length - 1];
        return FixedPointArithmeticsMathLibrary.asNewR(amount_, decimals1_, N_());
    }


    /**
    * => BPS
     */
    function yield(address[] memory path, address factory, address router, uint256 amountNIn) internal view returns (uint256 BPS_) {
        address token0_ = path[0];
        address token1_ = path[path.length - 1];
        uint256 bestAmountOutN_ = amountNIn * price(token0_, token1_, factory, router);
        uint256 realAmountOutN_ = amountOut(path, factory, router, amountNIn);

        /**
        * NOTE This will handle any anomalous edge cases.
         */
        if (bestAmountOutN_ == 0 || realAmountOutN_ == 0)
            return 0;

        /**
        * NOTE If the actual amount out is greater or equal to the best
        *      amount out (which is a desired outcome) the return will
        *      be of the full scale. Even if the real amount out is higher
        *      the function will not return any higher than the scale.
         */
        if (realAmountOutN_ >= bestAmountOutN_)
            return scale_();

        /**
        * NOTE Return the % of the best amount that is actually returned.
         */
        return FixedPointArithmeticsMathLibrary.scale(realAmountOutN_, bestAmountOutN_);
    }


    /**
    * => N
     */
    function swapExactTokensForTokens(address[] memory path, address factory, address router, uint256 amountNIn) internal returns (uint256) {
        uint8 decimals0_ = IERC20Metadata(path[0]).decimals();
        uint8 decimals1_ = IERC20Metadata(path[path.length - 1]).decimals();
        uint256 amountRIn_ = FixedPointArithmeticsMathLibrary.asNewR(amountNIn, N_(), decimals0_);
        IERC20(path[0]).approve(router, 0);
        IERC20(path[0]).approve(router, amountRIn_);
        uint256 amountOutR_ = amountOut(path, factory, router, amountNIn);
        uint256[] memory amounts_ = IUniswapV2Router02(router).swapExactTokensForTokens(amountRIn_, amountOutR_, path, address(this), block.timestamp);
        uint256 amount_ = amounts_[amounts_.length - 1];
        return FixedPointArithmeticsMathLibrary.asNewR(amount_, decimals1_, N_());
    }

    /**
    * => N
     */
    function swapExactTokensForTokensForMinYield(address[] memory path, address factory, address router, uint256 amountNIn, uint256 minYieldBPS) internal returns (uint256 N_) {
        if (minYieldBPS > scale_())
            revert("UniswapV2: will not return a yield higher than the scale");
        if (yield(path, factory, router, amountNIn) < minYieldBPS)
            revert("UniswapV2: yield failed to meet the minimum required yield");
        return swapExactTokensForTokens(path, factory, router, amountNIn);
    }


    /**
    * => N
     */
    function buy(address token, address asset, address factory, address router, uint256 amountNIn) internal returns (uint256 N_) {
        address[] memory path_ = new address[](2);
        path_[0] = asset;
        path_[1] = token;
        return swapExactTokensForTokens(path_, factory, router, amountNIn);
    }

    /**
    * => N
     */
    function sell(address token, address asset, address factory, address router, uint256 amountNIn) internal returns (uint256 N_) {
        address[] memory path_ = new address[](2);
        path_[0] = token;
        path_[1] = asset;
        return swapExactTokensForTokens(path_, factory, router, amountNIn);
    }


    /**
    * => N
     */
    function buyForMinYield(address token, address asset, address factory, address router, uint256 amountNIn, uint256 minYieldBPS) internal returns (uint256 N_) {
        address[] memory path_ = new address[](2);
        path_[0] = asset;
        path_[1] = token;
        return swapExactTokensForTokensForMinYield(path_, factory, router, amountNIn, minYieldBPS);
    }

    /**
    * => N
     */
    function sellForMinYield(address token, address asset, address factory, address router, uint256 amountNIn, uint256 minYieldBPS) internal returns (uint256 N_) {
        address[] memory path_ = new address[](2);
        path_[0] = token;
        path_[1] = asset;
        return swapExactTokensForTokensForMinYield(path_, factory, router, amountNIn, minYieldBPS);
    }


    function pairAddress(address token0, address token1, address factory) internal view returns (address) {
        return IUniswapV2Factory(factory).getPair(token0, token1);
    }

    function pairInterface(address token0, address token1, address factory) internal view returns (IUniswapV2Pair) {
        return IUniswapV2Pair(pairAddress(token0, token1, factory));
    }

    function pairReserves(address token0, address token1, address factory) internal view returns (uint256[] memory reserves_) {
        reserves_ = new uint256[](2);
        (
            reserves_[0], 
            reserves_[1],
        ) = pairInterface(token0, token1, factory).getReserves();
        return reserves_;
    }

    function pairIsZeroAddress(address token0, address token1, address factory) internal view returns (bool) {
        return pairAddress(token0, token1, factory) == address(0);
    }

    function pairIsSameLayoutAsGivenTokens(address token0, address token1, address factory) internal view returns (bool) {
        return token0 == pairInterface(token0, token1, factory).token0();
    }


    function N_() private pure returns (uint8) {
        return ImmutableLibrary.NATIVE_DECIMAL_REPRESENTATION();
    }

    function scale_() private pure returns (uint256) {
        return ImmutableLibrary.SCALE();
    }
}