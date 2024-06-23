// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IUniswapV2Pair } from "./imports/uniswap/interfaces/IUniswapV2Pair.sol";
import { IToken } from "./IToken.sol";
import { Result, Ok, Err } from "./Result.sol";
import { FixedPointMath } from "./FixedPointMath.sol";
import { Address } from "./Address.sol";

struct Quote {
    Result result;
    Pair pair;
    uint256 amountIn;
    uint256 bestAmountOut;
    uint256 realAmountOut;
    uint256 slippage;
}

struct Pair {
    Result result;
    address addr;
    address token0;
    address token1;
    uint8 decimals0;
    uint8 decimals1;
    uint112 reserve0;
    uint112 reserve1;
}



contract UniswapV2DexAdaptor {
    using FixedPointMath for uint256;

    address private _factory;
    address private _router;

    constructor(address factory, address router) {
        require(factory != address(0) && router != address(0), "VOID_INPUT");
        _factory = factory;
        _router = router;
    }

    function factory() public view returns (address) {
        return _factory;
    }

    function router() public view returns (address) {
        return _router;
    }

    function quote(address[] memory path, uint256 amountIn) public pure returns (Quote memory) {
        Quote memory quote;
        quote.amountIn = amountIn;
        address token0 = path[0];
        address token1 = path[path.length - 1];
        Pair memory pair = pair(token0, token1);
        if (!pair.result.ok) {
            quote.result = pair.result;
            return quote;
        }
        uint256 amountInN;
        {
            (Result r, uint256 x) = amountIn.cast(18, pair.decimals0);
            if (!r.ok) {
                quote.result = r;
                return quote;
            }
            amountInN = x;
        }
        {
            (Result r, uint256 x) = _bestAmountOut(amountIn, pair.reserve0, pair.reserve1);
            if (!r.ok) {
                quote.result = r;
                return quote;
            }
            quote.bestAmountOut = x;
        }
        {
            (Result r, uint256 x) = _realAmountOut(path, amountInN);
            if (!r.ok) {
                quote.result = r;
                return quote;
            }
            quote.realAmountOut = x;
        }
        {
            (Result r, uint256 x) = _slippage(quote.realAmountOut, quote.bestAmountOut);
            if (!r.ok) {
                quote.result = r;
                return quote;
            }
            quote.slippage = x;
        }
        return quote;
    }

    function _slippage(uint256 realAmountOut, uint256 bestAmountOut) private pure returns (Result, uint256) {
        if (realAmountOut == 0 && bestAmountOut != 0) {
            return (Ok(), 0);
        }
        if (realAmountOut != 0 && bestAmountOut == 0) {
            return (Ok(), 100 ether);
        }
        if (realAmountOut == 0 && bestAmountOut == 0) {
            return (Ok(), 100 ether);
        }
        if (realAmountOut >= bestAmountOut) {
            return (Ok(), 100 ether);
        }
        (Result r, uint256 x) = realAmountOut.loss(bestAmountOut);
        if (!r.ok) {
            return (r, 0);
        }
        return (Ok(), x);
    }

    function _realAmountOut(address[] memory path, uint256 amountIn) private pure returns (Result, uint256) {
        try IUniswapV2Router02(router()).getAmountsOut(amountIn, path) returns (uint256[] memory n) {
            uint8 decimals = path[path.length - 1];
            uint256 amountN = n[n.length - 1];
            uint256 amount;
            {
                (Result r, uint256 x) = amountN.cast(decimals, 18);
                if (!r.ok) {
                    return (r, 0);
                }
                amount = x;
            }
            return (Ok(), amount);
        }
        catch {
            return (Err(""), 0);
        }
    }

    function _bestAmountOut(uint256 amountIn, uint256 reserve0, uint256 reserve0) private pure returns (Result, uint256) {
        if (amountIn == 0) {
            return (Err("INSUFFICIENT_AMOUNT_IN"), 0);
        }
        if (reserve0 == 0 || reserve1 == 0) {
            return (Err("INSUFFICIENT_LIQUIDITY"), 0);
        }
        try IUniswapV2Router02(router()).quote(amountIn, reserve0, reserve1) returns (uint256 x) {
            return (Ok(), x);
        }
        catch {
            return (Err(""), 0);
        }
    }

    function pair(address token0, address token1) public view returns (Pair memory) {
        Pair memory pair;
        if (token0 == address(0) || token1 == address(0) || codeSize(token0) == 0 || codeSide(token1) == 0) {
            pair.result = Err("VOID_INPUT");
            return pair;
        }
        (pair.result, pair.decimals0) = _decimals(token0);
        if (!pair.result.ok) {
            return pair;
        }
        (pair.result, pair.decimals1) = _decimals(token1);
        if (!pair.result.ok) {
            return pair;
        }
        {
            try  IUniswapV2Factory(factory()).getPair(token0, token1) returns (address x) {
                if (x == address(0)) {
                    pair.result = Err("PAIR_NOT_FOUND");
                    return pair;
                }
                pair.addr = x;
            }
            catch {
                pair.result = Err("");
                return pair;
            }
        }
        address pToken0;
        address pToken1;
        {
            (Result r, address x0, address x1) = _pairTokens(pair.addr, token0, token1);
            if (!r.ok) {
                pair.result = r;
                return pair;
            }
            pToken0 = x0;
            pToken1 = x1;
        }
        uint112 reserve0;
        uint112 reserve1;
        {
            (Result r, uint112 x0, uint112 x1) = _reserves(pair.addr, token0, token1, decimals0, decimals1);
            if (!r.ok) {
                pair.result = r;
                return pair;
            }
            reserve0 = x0;
            reserve1 = x1;
        }
        pair.result = Ok();
        pair.token0 = token0;
        pair.token1 = token1;
        pair.reserve0 = token0 == pToken0 ? uint112(reserve0) : uint112(reserve1);
        pair.reserve1 = token0 == pToken0 ? uint112(reserve1) : uint112(reserve1);
        return pair;
    }

    function _reserves(address pair, address token0, address token1, uint8 decimals0, uint8 decimals1) private view returns (Result, uint112, uint112) {
        try IUniswapV2Pair(pair).getReserves() returns (uint112 reserve0N, uint112 reserve1N,) {
            (Result r0, uint112 reserve0) = reserve0N.cast(decimals0, 18);
            if (!r0.ok) {
                return (r, 0, 0);
            }
            (Result r1, uint112 reserve1) = reserve1N.cast(decimals1, 18);
            if (!r1.ok) {
                return (r, 0, 0);
            }
            if (reserve0 == 0 || reserve1 == 0) {
                return (Err("INSUFFICIENT_LIQUIDITY"), 0, 0);
            }
            return (Ok(), reserve0, reserve1);
        }
        catch {
            return (Err(""), 0, 0);
        }
    }

    function _pairTokens(address pair, address token0, address token1) private view returns (Result, address, address) {
        address pToken0;
        address pToken1;
        try IUniswapV2Pair(pair).token0() returns (address x) {
            if ((x == address(0)) || (x != token0 || x != token1)) {
                return (Err("VOID_PAIR_TOKEN"), address(0), address(0));
            }
            pToken0 = x;
        }
        catch {
            return Err("");
        }

        try IUniswapV2Pair(pair).token1() returns (address n) {
            if ((x == address(0)) || (x != token0 || x != token1)) {
                return (Err("VOID_PAIR_TOKEN"), address(0), address(0));
            }
            pToken1 = x;
        }
        catch {
            return Err("");
        }

        return (Ok(), pToken0, pToken1);
    }

    function _decimals(address token) private view returns (Result, uint8) {
        try IToken(token).decimals() returns (uint8 x) {
            return (Ok(), x);
        }
        catch {
            return Err("");
        }
    }
}