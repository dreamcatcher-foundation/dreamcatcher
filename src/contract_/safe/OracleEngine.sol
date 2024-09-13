// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IToken} from "../asset/token/IToken.sol";
import {IUniswapV2Router02} from "../import/uniswap/v2/interfaces/IUniswapV2Router02.sol";
import {IUniswapV2Factory} from "../import/uniswap/v2/interfaces/IUniswapV2Factory.sol";
import {IUniswapV2Pair} from "../import/uniswap/v2/interfaces/IUniswapV2Pair.sol";
import {FixedPointMathEngine} from "./FixedPointMathEngine.sol";
import {Exchange} from "./Exchange.sol";
import {Pair} from "./Pair.sol";
import {Side} from "./Side.sol";
import {Asset} from "./Asset.sol";
import {Quote} from "./Quote.sol";

contract OracleEngine is FixedPointMathEngine {

    function _totalAssets(Exchange memory exchange, Asset[] memory assets, IToken currency) internal view returns (Quote memory) {
        uint256 currencyBalance = _toNewPrecision(currency.balanceOf(address(this)), currency.decimals(), 18);
        uint256 real = currencyBalance;
        uint256 best = currencyBalance;

        for (uint256 i = 0; i < assets.length; i++) if (address(assets[i].cur) == address(currency)) if (_toNewPrecision(assets[i].tkn.balanceOf(address(this)), assets[i].tkn.decimals(), 18) != 0) {
            uint256 balance = _toNewPrecision(assets[i].tkn.balanceOf(address(this)), assets[i].tkn.decimals(), 18);
            Quote memory quote = _quote(exchange, assets[i], balance, Side.TKN_CUR_PATH);
            real += quote.real;
            best += quote.best;
        }

        uint256 slippage = _lss(real, best);

        if (best == 0) slippage = 0;

        return Quote({real: real, best: best, slippage: slippage});
    }

    function _quote(Exchange memory exchange, Asset memory asset, uint256 amount, Side side) internal view returns (Quote memory) {
        uint256 real = _realQuote(exchange.router, asset, amount, side);
        uint256 best = _bestQuote(exchange.router, exchange.factory, asset, amount, side);
        uint256 slippage = _lss(real, best);
        
        if (best == 0) slippage = 0;

        return Quote({real: real, best: best, slippage: slippage});
    }

    function _realQuote(IUniswapV2Router02 router, Asset memory asset, uint256 amount, Side side) private view returns (uint256) {
        uint8 dec0 = asset.tkn.decimals();
        uint8 dec1 = asset.cur.decimals();

        uint8 decimals0 =
            side == Side.TKN_CUR_PATH ? dec0 :
            side == Side.CUR_TKN_PATH ? dec1 :
            0;

        uint8 decimals1 =
            side == Side.TKN_CUR_PATH ? dec1 :
            side == Side.CUR_TKN_PATH ? dec0 :
            0;
        
        address[] memory path =
            side == Side.TKN_CUR_PATH ? asset.tknCurPath :
            side == Side.CUR_TKN_PATH ? asset.curTknPath :
            new address[](0);
    
        uint256 amountInX = _toNewPrecision(amount, 18, decimals0);

        uint256[] memory amountsOutX = router.getAmountsOut(amountInX, path);

        uint256 amountOutX = amountsOutX[amountsOutX.length - 1];

        return _toNewPrecision(amountOutX, decimals1, 18);
    }

    function _bestQuote(IUniswapV2Router02 router, IUniswapV2Factory factory, Asset memory asset, uint256 amount, Side side) private view returns (uint256) {
        IToken token0 = asset.tkn;
        IToken token1 = asset.cur;
        uint8 decimals0 = asset.tkn.decimals();
        uint8 decimals1 = asset.cur.decimals();

        uint8 decimals = 
            side == Side.TKN_CUR_PATH ? decimals0 :
            side == Side.CUR_TKN_PATH ? decimals1 :
            0;

        IToken tkn0 =
            side == Side.TKN_CUR_PATH ? token0 :
            side == Side.CUR_TKN_PATH ? token1 :
            IToken(0x0000000000000000000000000000000000000000);

        IToken tkn1 =
            side == Side.TKN_CUR_PATH ? token1 :
            side == Side.CUR_TKN_PATH ? token0 :
            IToken(0x0000000000000000000000000000000000000000);

        uint256 amountX = _toNewPrecision(amount, 18, decimals);

        Pair memory pair = _pair(factory, tkn0, tkn1);

        return router.quote(amountX, pair.reserve0, pair.reserve1);
    }

    function _pair(IUniswapV2Factory factory, IToken token0, IToken token1) private view returns (Pair memory) {
        IUniswapV2Pair pair = IUniswapV2Pair(factory.getPair(address(token0), address(token1)));
        IToken pairToken0 = IToken(pair.token0());
        IToken pairToken1 = IToken(pair.token1());

        (uint256 res0, uint256 res1,) = pair.getReserves();

        bool sorted =
            address(token0) == address(pairToken0) &&
            address(token1) == address(pairToken1);

        if (!sorted) (res0, res1) = _sort(res0, res1);

        uint8 decimals0 = token0.decimals();
        uint8 decimals1 = token1.decimals();

        return Pair({
            pair: pair,
            token0: token0,
            token1: token1,
            reserve0: _toNewPrecision(res0, decimals0, 18),
            reserve1: _toNewPrecision(res1, decimals1, 18),
            decimals0: decimals0,
            decimals1: decimals1
        });
    }

    function _sort(uint256 x, uint256 y) private pure returns (uint256, uint256) {
        return (y, x);
    }
}