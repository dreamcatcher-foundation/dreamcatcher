// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IERC20Metadata } from "./imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { IUniswapV2Router02 } from "./imports/uniswap/interfaces/IUniswapV2Router02.sol";
import { IUniswapV2Factory } from "./imports/uniswap/interfaces/IUniswapV2Factory.sol";
import { IUniswapV2Pair } from "./imports/uniswap/interfaces/IUniswapV2Pair.sol";
import { IToken } from "./IToken.sol";
import { ResultLib, Result, Ok, Err } from "./Result.sol";
import { FixedPointMath } from "./FixedPointMath.sol";
import { Address } from "./Address.sol";
import { Pair } from "./Pair.sol";
import { Quote } from "./Quote.sol";
import { Strings } from "./imports/openzeppelin/utils/Strings.sol";

abstract contract UniswapPriceFeed {
    using FixedPointMath for uint256;
    using Strings for uint256;
    
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

    function quote(address[] memory path, uint256 amountIn) public view returns (Quote memory) {
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
            (Result memory r, uint256 x) = amountIn.cast(18, pair.decimals0);
            if (!r.ok) {
                quote.result = r;
                return quote;
            }
            amountInN = x;
        }
        uint256 bestAmountOut;
        {
            (Result memory r, uint256 x) = _bestAmountOut(amountIn, pair.reserve0, pair.reserve1);
            if (!r.ok) {
                quote.result = r;
                return quote;
            }
            bestAmountOut = x;
        }
        uint256 realAmountOut;
        {
            (Result memory r, uint256 x) = _realAmountOut(path, amountInN);
            if (!r.ok) {
                quote.result = r;
                return quote;
            }
            realAmountOut = x;
        }
        uint256 slippage;
        {
            (Result memory r, uint256 x) = _slippage(realAmountOut, bestAmountOut);
            if (!r.ok) {
                quote.result = r;
                return quote;
            }
            slippage = x;
        }
        quote.result = Ok();
        quote.pair = pair;
        quote.bestAmountOut = bestAmountOut;
        quote.realAmountOut = realAmountOut;
        quote.slippage = slippage;
        return quote;
    }

    function _slippage(uint256 realAmountOut, uint256 bestAmountOut) private pure returns (Result memory, uint256) {
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
        (Result memory r, uint256 x) = realAmountOut.loss(bestAmountOut);
        if (!r.ok) {
            return (r, 0);
        }
        return (Ok(), x);
    }

    function _realAmountOut(address[] memory path, uint256 amountIn) private view returns (Result memory, uint256) {
        try IUniswapV2Router02(router()).getAmountsOut(amountIn, path) returns (uint256[] memory n) {
            uint8 decimals = IToken(path[path.length - 1]).decimals();
            uint256 amountN = n[n.length - 1];
            uint256 amount;
            {
                (Result memory r, uint256 x) = amountN.cast(decimals, 18);
                if (!r.ok) {
                    return (r, 0);
                }
                amount = x;
            }
            return (Ok(), amount);
        }
        catch Error(string memory code) {
            return (Err(code), 0);
        }
        catch Panic(uint256 code) {
            return (Err(code.toString()), 0);
        }
        catch {
            return (Err(""), 0);
        }
    }

    function _bestAmountOut(uint256 amountIn, uint112 reserve0, uint112 reserve1) private view returns (Result memory, uint256) {
        if (amountIn == 0) {
            return (Err("INSUFFICIENT_AMOUNT_IN"), 0);
        }
        if (reserve0 == 0 || reserve1 == 0) {
            return (Err("INSUFFICIENT_LIQUIDITY"), 0);
        }
        try IUniswapV2Router02(router()).quote(amountIn, reserve0, reserve1) returns (uint256 x) {
            return (Ok(), x);
        }
        catch Error(string memory code) {
            return (Err(code), 0);
        }
        catch Panic(uint256 code) {
            return (Err(code.toString()), 0);
        }
        catch {
            return (Err(""), 0);
        }
    }

    function pair(address token0, address token1) public view returns (Pair memory) {
        Pair memory pair;
        if (token0 == address(0) || token1 == address(0)) {
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
            catch Error(string memory code) {
                pair.result = Err(code);
                return pair;
            }
            catch Panic(uint256 code) {
                pair.result = Err(code.toString());
                return pair;
            }
            catch {
                pair.result = Err("");
                return pair;
            }
        }
        uint8 decimals0;
        uint8 decimals1;
        {
            {
                (Result memory r, uint8 x) = _decimals(token0);
                if (!r.ok) {
                    pair.result = r;
                    return pair;
                }
                decimals0 = x;
            }
            {
                (Result memory r, uint8 x) = _decimals(token1);
                if (!r.ok) {
                    pair.result = r;
                    return pair;
                }
                decimals1 = x;
            }
        }
        address pToken0;
        address pToken1;
        {
            (Result memory r, address x0, address x1) = _pairTokens(pair.addr);
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
            (Result memory r, uint112 reserve0N, uint112 reserve1N) = _reserves(pair.addr);
            if (!r.ok) {
                pair.result = r;
                return pair;
            }
            if (token0 == pToken0) {
                {
                    (Result memory r, uint256 reserve0CastedWithDecimals0) = uint256(reserve0N).cast(decimals0, 18);
                    if (!r.ok) {
                        pair.result = r;
                        return pair;
                    }
                    reserve0 = uint112(reserve0CastedWithDecimals0);
                }
                {
                    (Result memory r, uint256 reserve1CastedWithDecimals1) = uint256(reserve1N).cast(decimals1, 18);
                    if (!r.ok) {
                        pair.result = r;
                        return pair;
                    }
                    reserve1 = uint112(reserve1CastedWithDecimals1);
                }
            }
            else {
                {
                    (Result memory r, uint256 reserve1CastedWithDecimals0) = uint256(reserve1N).cast(decimals0, 18);
                    if (!r.ok) {
                        pair.result = r;
                        return pair;
                    }
                    reserve0 = uint112(reserve1CastedWithDecimals0);
                }
                {
                    (Result memory r, uint256 reserve0CastedWithDecimals1) = uint256(reserve0N).cast(decimals1, 18);
                    if (!r.ok) {
                        pair.result = r;
                        return pair;
                    }
                    reserve1 = uint112(reserve0CastedWithDecimals1);
                } 
            }
        }
        pair.result = Ok();
        pair.token0 = token0;
        pair.token1 = token1;
        pair.reserve0 = reserve0;
        pair.reserve1 = reserve1;
        return pair;
    }

    function _reserves(address pair) private view returns (Result memory, uint112, uint112) {
        try IUniswapV2Pair(pair).getReserves() returns (uint112 reserve0N, uint112 reserve1N, uint32) {
            if (reserve0N == 0 || reserve1N == 0) {
                return (Err("INSUFFICIENT_LIQUIDITY"), 0, 0);
            }
            return (Ok(), reserve0N, reserve1N);
        }
        catch Error(string memory code) {
            return (Err(code), 0, 0);
        }
        catch Panic(uint256 code) {
            return (Err(code.toString()), 0, 0);
        }
        catch {
            return (Err(""), 0, 0);
        }
    }

    function _pairTokens(address pair) private view returns (Result memory, address, address) {
        address pToken0;
        address pToken1;
        try IUniswapV2Pair(pair).token0() returns (address x) {
            if (x == address(0)) {
                return (Err("VOID_PAIR_TOKEN"), address(0), address(0));
            }
            pToken0 = x;
        }
        catch Error(string memory code) {
            return (Err(code), address(0), address(0));
        }
        catch Panic(uint256 code) {
            return (Err(code.toString()), address(0), address(0));
        }
        catch {
            return (Err(""), address(0), address(0));
        }

        try IUniswapV2Pair(pair).token1() returns (address x) {
            if (x == address(0)) {
                return (Err("VOID_PAIR_TOKEN"), address(0), address(0));
            }
            pToken1 = x;
        }
        catch Error(string memory code) {
            return (Err(code), address(0), address(0));
        }
        catch Panic(uint256 code) {
            return (Err(code.toString()), address(0), address(0));
        }
        catch {
            return (Err(""), address(0), address(0));
        }

        return (Ok(), pToken0, pToken1);
    }

    function _decimals(address token) private view returns (Result memory, uint8) {
        try IToken(token).decimals() returns (uint8 x) {
            return (Ok(), x);
        }
        catch Error(string memory code) {
            return (Err(code), 0);
        }
        catch Panic(uint256 code) {
            return (Err(code.toString()), 0);
        }
        catch {
            return (Err(""), 0);
        }
    }
}

abstract contract UniswapBroker is UniswapPriceFeed {
    using FixedPointMath for uint256;
    using Strings for uint256;
    using ResultLib for Result;

    event Swap(address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);

    function swap(address[] memory path, uint256 amountIn, uint256 slippageThreshold) public {
        Quote memory q = quote(path, amountIn);
        q.result.required();
        uint256 callerBalance;
        {
            try IToken(q.pair.token0).balanceOf(msg.sender) returns (uint256 balanceN) {
                {
                    (Result memory r, uint256 x) = balanceN.cast(q.pair.decimals0, 18);
                    r.required();
                    callerBalance = x;
                }
            }
            catch Error(string memory code) {
                Err(code).panic();
            }
            catch Panic(uint256 code) {
                Err(code.toString()).panic();
            }
            catch {
                Err("").panic();
            }
        }
        if (callerBalance < amountIn) {
            Err("INSUFFICIENT_BALANCE").panic();
        }
        uint256 callerAllowance;
        {
            try IToken(q.pair.token0).allowance(msg.sender, address(this)) returns (uint256 allowanceN) {
                {
                    (Result memory r, uint256 x) = allowanceN.cast(q.pair.decimals0, 18);
                    r.required();
                    callerAllowance = x;
                }
            }
            catch Error(string memory code) {
                Err(code).panic();
            }
            catch Panic(uint256 code) {
                Err(code.toString()).panic();
            }
            catch {
                Err("").panic();
            }
        }
        if (callerAllowance < amountIn) {
            Err("INSUFFICIENT_ALLOWANCE").panic();
        }
        uint256 amountInN;
        {
            (Result memory r, uint256 x) = amountIn.cast(18, q.pair.decimals0);
            r.required();
            amountInN = x;
        }
        {
            try IToken(q.pair.token0).transferFrom(msg.sender, address(this), amountIn) returns (bool success) {
                if (!success) {
                    Err("FAILED_PAYMENT").panic();
                }
            }
            catch Error(string memory code) {
                Err(code).panic();
            }
            catch Panic(uint256 code) {
                Err(code.toString()).panic();
            }
            catch {
                Err("").panic();
            }
        }
        {
            try IToken(q.pair.token0).approve(router(), 0) returns (bool success) {
                if (!success) {
                    Err("FAILED_TO_APPROVE_ROUTER").panic();
                }
            }
            catch Error(string memory code) {
                Err(code).panic();
            }
            catch Panic(uint256 code) {
                Err(code.toString()).panic();
            }
            catch {
                Err("").panic();
            }
        }
        {
            try IToken(q.pair.token0).approve(router(), amountInN) returns (bool success) {
                if (!success) {
                    Err("FAILED_TO_APPROVE_ROUTER").panic();
                }
            }
            catch Error(string memory code) {
                Err(code).panic();
            }
            catch Panic(uint256 code) {
                Err(code.toString()).panic();
            }
            catch {
                Err("").panic();
            }
        }
        if (q.slippage > slippageThreshold) {
            Err("SLIPPAGE_EXCEEDS_THRESHOLD").panic();
        }
        uint256 amountOutN;
        {
            try IUniswapV2Router02(router()).swapExactTokensForTokens(amountInN, 0, path, msg.sender, block.timestamp) returns (uint256[] memory amountsOutN) {
                amountOutN = amountsOutN[amountsOutN.length - 1];
            }
            catch Error(string memory code) {
                Err(code).panic();
            }
            catch Panic(uint256 code) {
                Err(code.toString()).panic();
            }
            catch {
                Err("").panic();
            }
        }
        uint256 amountOut;
        {
            (Result memory r, uint256 x) = amountOutN.cast(q.pair.decimals1, 18);
            r.required();
            amountOut = x;
        }
        {
            try IToken(q.pair.token0).approve(router(), 0) returns (bool success) {
                if (!success) {
                    Err("FAILED_TO_APPROVE_ROUTER").panic();
                }
            }
            catch Error(string memory code) {
                Err(code).panic();
            }
            catch Panic(uint256 code) {
                Err(code.toString()).panic();
            }
            catch {
                Err("").panic();
            }
        }
        emit Swap(q.pair.token0, q.pair.token1, amountIn, amountOut);
        Ok();
    }
}

contract UniswapAdaptor is UniswapPriceFeed, UniswapBroker {
    constructor(address factory, address router) UniswapPriceFeed(factory, router) {}
}