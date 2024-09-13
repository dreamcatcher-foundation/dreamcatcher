// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IToken} from "../asset/token/IToken.sol";
import {IUniswapV2Router02} from "../import/uniswap/v2/interfaces/IUniswapV2Router02.sol";
import {IUniswapV2Factory} from "../import/uniswap/v2/interfaces/IUniswapV2Factory.sol";
import {IUniswapV2Pair} from "../import/uniswap/v2/interfaces/IUniswapV2Pair.sol";
import {FixedPointEngine} from "../engine/FixedPointEngine.sol";


abstract contract TokenHandlerEngine is FixedPointEngine {

    function _name(IToken token) internal view returns (string memory) {
        return token.name();
    }

    function _symbol(IToken token) internal view returns (string memory) {
        return token.symbol();
    }

    function _decimals(IToken token) internal view returns (uint8) {
        uint8 decimals = token.decimals();
        if (decimals == 0) revert ("unsupported-token");
        if (decimals > 18) revert ("unsupported-token");
        return decimals;
    }


    function _balanceOf(IToken token, address account) internal view returns (uint256) {
        return _toEther(token, token.balanceOf(account));
    }

    function _allowance(IToken token, address account, address spender) internal view returns (uint256) {
        return _toEther(token, token.allowance(account, spender));
    }

    function _totalSupply(IToken token) internal view returns (uint256) {
        return _toEther(token, token.totalSupply());
    }


    function _transfer(IToken token, address account, uint256 amount) internal returns (bool) {
        return token.transfer(account, _toToken(token, amount));
    }

    function _transferFrom(IToken token, address from, address to, uint256 amount) internal returns (bool) {
        return token.transferFrom(from, to, _toToken(token, amount));
    }


    function _toToken(IToken token, uint256 amount) private view returns (uint256) {
        return _toNewPrecision(amount, 18, _decimals(token));
    }

    function _toEther(IToken token, uint256 amount) private view returns (uint256) {
        return _toNewPrecision(amount, _decimals(token), 18);
    }
}











interface IAsset {
    function tkn() external view returns (IToken);
    function cur() external view returns (IToken);
    function tknCurPath() external view returns (address[] memory);
    function curTknPath() external view returns (address[] memory);
    function targetAllocation() external view returns (uint256);
}

contract Assets {
    IToken private _tkn;
    IToken private _cur;
    address[] private _tknCurPath;
    address[] private _curTknPath;
    uint256 private _targetAllocation;

    constructor(IToken tkn, IToken cur, address[] memory tknCurPath, address[] memory curTknPath, uint256 targetAllocation) {
        require(address(tkn) != address(0));
        require(address(cur) != address(0));
        require(tknCurPath.length <= 8);
        require(curTknPath.length <= 8);
        require(address(tknCurPath[0]) == address(tkn));
        require(address(curTknPath[0]) == address(cur));
        require(address(tknCurPath[tknCurPath.length - 1]) == address(cur));
        require(address(curTknPath[curTknPath.length - 1]) == address(tkn));
        for (uint256 i = 0; i < tknCurPath.length; i++) require(address(tknCurPath[i]) != address(0));
        for (uint256 i = 0; i < curTknPath.length; i++) require(address(curTknPath[i]) != address(0));
        require(targetAllocation <= 100e18);
    }

    function tkn() public view returns (IToken) {
        return _tkn;
    }

    function cur() public view returns (IToken) {
        return _cur;
    }

    function setTargetAllocation(uint256 percentage) internal {
        require(percentage <= 100e18);
        _targetAllocation = percentage;
    }
}


struct Asset {
    IToken tkn;
    IToken cur;
    address[] tknCurPath;
    address[] curTknPath;
}





struct Exchange {
    IUniswapV2Router02 router;
    IUniswapV2Factory factory;
}

function ExchangeImpl(IUniswapV2Router02 router, IUniswapV2Factory factory) pure returns (Exchange memory) {
    require(address(router) != address(0));
    require(address(factory) != address(0));
    return Exchange({router: router, factory: factory});
}

library ExchangeEngine {

    function _reserve(Exchange memory exchange, IToken token0, IToken token1) private view returns (uint256, uint256) {
        require(address(token0) != address(token1), "duplicate-tokens");
        require(address(token0) != address(0), "token-0-is-zero-address");
        require(address(token1) != address(0), "token-1-is-zero-address");
        IUniswapV2Pair pair = IUniswapV2Pair(exchange.factory.getPair(address(token0), address(token1)));
        require(address(pair) != address(0), "pair-not-found");

    }

    function _sort(uint256 x, uint256 y) private pure returns (uint256, uint256) {
        return (y, x);
    }
}


enum Side {
    TknCurPath,
    CurTknPath
}

contract UniswapV2ExchangeAdaptor is FixedPointEngine, TokenHandlerEngine {
    using ExchangeEngine for Exchange;

    IUniswapV2Router02 private _router;
    IUniswapV2Factory private _factory;

    constructor(IUniswapV2Router02 router, IUniswapV2Factory factory) {
        _router = router;
        _factory = factory;
        Exchange exchange = ExchangeImpl(router, factory);
        
    }

    function quote(IAsset asset, uint256 amount, Side side) public view returns (uint256, uint256, uint256) {
        uint256 real = _realQuote(asset, amount, side);
        uint256 best = _bestQuote(asset, amount, side);
        uint256 slippage = _lss(real, best);
        if (best == 0) slippage = 0;
        return (real, best, slippage);
    }

    function _realQuote(IAsset asset, uint256 amount, Side side) private view returns (uint256) {
        uint8 dec0 = asset.tkn().decimals();
        uint8 dec1 = asset.cur().decimals();
        uint8 decimals0 =
            side == Side.TknCurPath ? dec0 :
            side == Side.CurTknPath ? dec1 :
            0;
        uint8 decimals1 =
            side == Side.TknCurPath ? dec1 :
            side == Side.CurTknPath ? dec0 :
            0;
        address[] memory path =
            side == Side.TknCurPath ? asset.tknCurPath() :
            side == Side.CurTknPath ? asset.curTknPath() :
            new address[](0);
        uint256 amountInX = _toNewPrecision(amount, 18, decimals0);
        uint256[] memory amountsOutX = _router.getAmountsOut(amountInX, path);
        uint256 amountOutX = amountsOutX[amountsOutX.length - 1];
        return _toNewPrecision(amountOutX, decimals1, 18);
    }

    function _best(address[] memory path, uint256 amount) private view returns (uint256) {
        IToken token0 = IToken(path[0]);
        IToken token1 = IToken(path[path.length - 1]);
        uint8 decimals0 = token0.decimals();
        (uint256 reserve0, uint256 reserve1) = _reserve(token0, token1);
        return _router.quote(_toNewPrecision(amount, 18, decimals0), reserve0, reserve1);
    }

    function _bestQuote(IAsset asset, uint256 amount, Side side) private view returns (uint256) {
        IToken token0 = asset.tkn();
        IToken token1 = asset.cur();
        uint8 decimals0 = token0.decimals();
        uint8 decimals1 = token1.decimals();
        uint8 decimals =
            side == Side.TknCurPath ? decimals0 :
            side == Side.CurTknPath ? decimals1 :
            0;
        IToken tkn0 =
            side == Side.TknCurPath ? token0 :
            side == Side.CurTknPath ? token1 :
            IToken(address(0));
        IToken tkn1 =
            side == Side.TknCurPath ? token1 :
            side == Side.CurTknPath ? token0 :
            IToken(address(0));
        uint256 amountX = _toNewPrecision(amount, 18, decimals);
        (uint256 reserve0, uint256 reserve1) = _reserve(tkn0, tkn1);
        return _router.quote(amountX, reserve0, reserve1);
    }

    function _reserve(IToken token0, IToken token1) private view returns (uint256, uint256) {
        require(address(token0) != address(token1), "token 0 is the same as token 1");
        require(address(token0) != 0x0000000000000000000000000000000000000000, "token 0 is zero");
        require(address(token1) != 0x0000000000000000000000000000000000000000, "token 1 is zero");
        IUniswapV2Pair pair = IUniswapV2Pair(_factory.getPair(address(token0), address(token1)));
        require(address(pair) != 0x0000000000000000000000000000000000000000, "missing pair");
        IToken pairToken0 = IToken(pair.token0());
        IToken pairToken1 = IToken(pair.token1());
        require(address(pairToken0) != 0x0000000000000000000000000000000000000000, "pair token 0 is zero");
        require(address(pairToken1) != 0x0000000000000000000000000000000000000000, "pair token 1 is zero");
        require(address(token0) == address(pairToken0) || address(token0) == address(pairToken1));
        require(address(token1) == address(pairToken0) || address(token1) == address(pairToken1));
        (uint256 reserve0, uint256 reserve1,) = pair.getReserves();
        require(reserve0 != 0);
        require(reserve1 != 0);
        bool sorted =
            address(token0) == address(pairToken0) &&
            address(token1) == address(pairToken1);
        if (!sorted) (reserve0, reserve1) = _sort(reserve0, reserve1);
        return (
            _toNewPrecision(reserve0, _decimals(token0), 18),
            _toNewPrecision(reserve1, _decimals(token1), 18)
        );
    }

    function _sort(uint256 x, uint256 y) private pure returns (uint256, uint256) {
        return (y, x);
    }
}