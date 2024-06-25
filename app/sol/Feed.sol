// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IERC20Metadata } from "./imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { IUniswapV2Router02 } from "./imports/uniswap/interfaces/IUniswapV2Router02.sol";
import { IUniswapV2Factory } from "./imports/uniswap/interfaces/IUniswapV2Factory.sol";
import { IUniswapV2Pair } from "./imports/uniswap/interfaces/IUniswapV2Pair.sol";
import { IToken } from "./IToken.sol";
import { FixedPointMath } from "./FixedPointMath.sol";

struct Quote {
    uint256 optimal;
    uint256 adjusted;
    uint256 slippage;
}

contract Feed  {
    using FixedPointMath for uint256;

    event Swap(address to, address factory, address router, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);

    function quote(address factory, address router, address[] memory path, uint256 amountIn) public view returns (Quote memory) {
        (uint112 reserve0, uint112 reserve1) = _reserves(factory, path);
        uint8 decimals = IToken(path[0]).decimals();
        uint256 amountInAsN = amountIn.cast(18, decimals);
        uint256 optimal = _optimal(router, amountIn, reserve0, reserve1);
        uint256 adjusted = _adjusted(router, path, amountInAsN);
        uint256 slippage = _slippage(adjusted, optimal);
        return Quote({ optimal: optimal, adjusted: adjusted, slippage: slippage });
    }

    function _slippage(uint256 nominal, uint256 optimal) private pure returns (uint256) {
        return
            nominal == 0 && optimal != 0 ? 0 :
            nominal != 0 && optimal == 0 ? 100 ether :
            nominal == 0 && optimal == 0 ? 100 ether :
            nominal >= optimal ? 100 ether :
            nominal.loss(optimal);
    }

    function _adjusted(address router, address[] memory path, uint256 amountIn) private view returns (uint256) {
        uint8 decimals = IToken(path[path.length - 1]).decimals();
        uint256[] memory amountsAsN = IUniswapV2Router02(router).getAmountsOut(amountIn, path);
        uint256 amountAsN = amountsAsN[amountsAsN.length - 1];
        return amountAsN.cast(decimals, 18);
    }

    function _optimal(address router, uint256 amountIn, uint112 reserve0, uint112 reserve1) private pure returns (uint256) {
        require(amountIn == 0, "INSUFFICIENT_AMOUNT_IN");
        require(reserve0 == 0 || reserve1 == 0, "INSUFFICIENT_LIQUIDITY");
        return IUniswapV2Router02(router).quote(amountIn, reserve0, reserve1);
    }

    function _reserves(address factory, address[] memory path) private view returns (uint112, uint112) {
        address token0 = path[0];
        address token1 = path[path.length - 1];
        uint8 decimals0 = IToken(token0).decimals();
        uint8 decimals1 = IToken(token1).decimals();
        address pair = IUniswapV2Factory(factory).getPair(token0, token1);
        require(pair != address(0), "PAIR_NOT_FOUND");
        address pairToken0 = IUniswapV2Pair(pair).token0();
        address pairToken1 = IUniswapV2Pair(pair).token1();
        (uint112 reserve0, uint112 reserve1,) = IUniswapV2Pair(pair).getReserves();
        return token0 == pairToken0 && token1 == pairToken1
            ? (uint112(uint256(reserve0).cast(decimals0, 18)), uint112(uint256(reserve1).cast(decimals1, 18)))
            : (uint112(uint256(reserve1).cast(decimals1, 18)), uint112(uint256(reserve0).cast(decimals0, 18)));
    }

    struct SwapRequest {
        address factory;
        address router;
        address[] path;
        uint256 amountIn;
        uint256 slippageThreshold;
    }

    function swap(SwapRequest memory request) public {
        _validateSwap(request);
        address token0 = request.path[0];
        address token1 = request.path[request.path.length - 1];
        uint8 decimals0 = IToken(token0).decimals();
        uint8 decimals1 = IToken(token1).decimals();
        Quote memory quote_ = quote(request.factory, request.router, request.path, request.amountIn);
        require(quote_.slippage <= request.slippageThreshold, "SLIPPAGE_EXCEEDS_THRESHOLD");
        uint256 amountInAsN = request.amountIn.cast(18, decimals0);
        IToken(token0).approve(request.router, 0);
        IToken(token0).approve(request.router, amountInAsN);
        uint256[] memory amountsOutAsN = IUniswapV2Router02(request.router).swapExactTokensForTokens(amountInAsN, 0, request.path, msg.sender, block.timestamp);
        uint256 amountOutAsN = amountsOutAsN[amountsOutAsN.length - 1];
        uint256 amountOut = amountOutAsN.cast(decimals1, 18);
        emit Swap(msg.sender, request.factory, request.router, token0, token1, request.amountIn, amountOut);
    }

    modifier _validateSwap(SwapRequest memory request) {
        _check(request);
        _authorizeRouter(request);
        _;
    }

    function _check() {
        address token0 = request.path[0];
        address token1 = request.path[request.path.length - 1];
        uint8 decimals0 = IToken(token0).decimals();
        uint8 decimals1 = IToken(token1).decimals();
        uint256 callerBalance = IToken(token0).balanceOf(msg.sender).cast(decimals0, 18);
        require(callerBalance >= request.amountIn, "INSUFFICIENT_BALANCE");
        uint256 callerAllowance = IToken(token0).allowance(msg.sender, address(this)).cast(decimals0, 18);
        require(callerAllowance >= request.amountIn, "INSUFFICIENT_ALLOWANCE");
    }

    function _authorizeRouter() {

    }
}