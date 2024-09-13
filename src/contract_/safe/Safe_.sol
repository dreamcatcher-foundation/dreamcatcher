// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IUniswapV2Router02} from "../import/uniswap/v2/interfaces/IUniswapV2Router02.sol";
import {IUniswapV2Factory} from "../import/uniswap/v2/interfaces/IUniswapV2Factory.sol";
import {IUniswapV2Pair} from "../import/uniswap/v2/interfaces/IUniswapV2Pair.sol";
import {IERC20} from "../import/openzeppelin/token/ERC20/IERC20.sol";
import {IOwnableToken} from "../asset/token/ownable/IOwnableToken.sol";
import {Asset} from "./Asset.sol";
import {Quote} from "./Quote.sol";
import {Pair} from "./Pair.sol";
import {Side} from "./Side.sol";


contract Safe {
    event Mint(address indexed account, uint256 amountIn, uint256 amountOut, IERC20 tokenIn, IERC20 tokenOut);
    event Burn(address indexed account, uint256 amountIn, uint256 amountOut, IERC20 tokenIn, IERC20 tokenOut);

    Asset[] private _assets;
    IOwnableToken private _vToken;
    IUniswapV2Router02 private _quickswap = IUniswapV2Router02(0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff);
    IERC20 private _usdc = IERC20(0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359);

    constructor(IOwnableToken vToken) {
    
    }

    function installVToken(IOwnableToken vToken) public {
        _vToken = vToken;
    }

    function name() public view returns (string memory) {
        require(address(vToken()) != address(0), "v-token-not-installed");
        return _vToken.name();
    }

    function vToken() public view returns (IOwnableToken) {
        require(condition);
        return _vToken;
    }


    function quote() public view returns (Quote memory) {
        Quote memory quote = totalAssets();
        return
            totalSupply() == 0 ?

            Quote({
                real: 0,
                best: 0,
                slippage: 0
            }) :
            

            Quote({
                real: _div(quote.real, totalSupply()),
                best: _div(quote.best, totalSupply()),
                slippage: quote.slippage
            });
    }


    function totalAssets() public view returns (Quote memory) {
        uint256 usdcBalance = _toNewPrecision(_usdc.balanceOf(address(this)), _usdc.decimals(), 18);
        uint256 realTotalAssets = usdcBalance;
        uint256 bestTotalAssets = usdcBalance;
        for (uint256 i = 0; i < _assets.length; i++) if (_toNewPrecision(_assets[i].token.balanceOf(address(this)), _assets[i].token.decimals(), 18) != 0) {
            Quote memory quote = _quote(_assets[i], balance, Side.TKN_CUR_PATH);
            realTotalAssets += quote.real;
            bestTotalAssets += quote.best;
        }
        uint256 slippage = _lss(realTotalAssets, bestTotalAssets);
        return
            bestTotalAssets == 0 ? 0 :

            Quote({
                real: realTotalAssets,
                best: bestTotalAssets,
                slippage: slippage
            });
    }

    function totalSupply() public view returns (uint256) {
        return _vToken.totalSupply();
    }

    
    function previewMint(uint256 assetsIn) public view returns (uint256) {
        uint256 assets = totalAssets().best;
        uint256 supply = totalSupply();
        return _previewMint(assetsIn, assets, supply);
    }

    function _previewMint(uint256 assetsIn, uint256 totalAssets, uint256 totalSupply) private pure returns (uint256) {
        return
            assetsIn == 0 ? 0 :

            totalAssets == 0 && totalSupply == 0 ? _initialMint() :
            totalAssets != 0 && totalSupply == 0 ? _initialMint() :
            totalAssets == 0 && totalSupply != 0 ? 0 :
            
            _div(_mul(assetsIn, totalSupply), totalAssets);
    }

    function _initialMint() private pure returns (uint256) {
        return 1000000e18;
    }


    function previewBurn(uint256 supplyIn) public view returns (uint256) {
        uint256 assets = totalAssets().best;
        uint256 supply = totalSupply();
        return _previewBurn(supplyIn, assets, supply);
    }

    function _previewBurn(uint256 supplyIn, uint256 totalAssets, uint256 totalSupply) private pure returns (uint256) {
        return
            supplyIn == 0 ? 0 :

            totalAssets == 0 && totalSupply == 0 ? 0 :
            totalAssets != 0 && totalSupply == 0 ? 0 :
            totalAssets == 0 && totalSupply != 0 ? 0 :

            _div(_mul(supplyIn, totalAssets), totalSupply);
    }





    function mint(uint256 assetsIn) public {
        uint256 amount = previewMint(assetsIn);
        _pullUsdc(assetsIn);
        _mint(account, amount);
        emit Mint(msg.sender, assetsIn, amount, vToken(), _usdc);
        return;
    }

    function _pullUsdc(uint256 amount) private {
        bool success = _usdc.transferFrom(msg.sender, address(this), _toNewPrecision(assetsIn, 18, _usdc.decimals()));
        require(success, "unable-to-pull-usdc");
        return;
    }

    function _mint(address account, uint256 amount) private {
        return _vToken.mint(account, amount);
    }





    function burn(uint256 supplyIn) public {
        _requestVTokenTransfer(supplyIn);
        uint256 usdcPayableBalance = _usdcPayableBalance(_ownership(supplyIn));
        _burn(address(this), supplyIn);

    }

    function _requestVTokenTransfer(uint256 amount) private {
        address user = msg.sender;
        address recipient = address(this);
        bool success = _vToken.transferFrom(user, recipient, amount);
        require(success);
        return;
    }

    function _usdcPayableBalance(uint256 ownership) private view returns (uint256) {
        return _slc(_toNewPrecision(_usdc.balanceOf(address(this)), _usdc.decimals(), 18), ownership);
    }

    function _ownership(uint256 supplyIn) private view returns (uint256) {
        return _pct(supplyIn, totalSupply());
    }

    function _x(uint256 i, uint256 ownership) private {
        Asset storage asset = _assets[i];
        uint256 payableBalance = _slc(_toNewPrecision(asset.token.balanceOf(address(this)), asset.token.decimals(), 18), ownership);
        if (payableBalance > 0) {
            Quote memory quote = _quote(asset, payableBalance, Side.TKN_CUR_PATH);
            if (quote.slippage <= 2e18) {

            }
        }
    }

    function _transfer(Asset memory asset, uint256 amount) private {
        uint256 amountX = _toNewPrecision(amount, 18, asset.tkn.);
        asset.tkn.transfer(msg.sender, amount);
    }

    function _burn(address account, uint256 amount) private {
        return _vToken.burn(account, amount);
    }





    function _quote(Asset memory asset, uint256 amount, Side side) private view returns (Quote memory) {
        uint256 real = _realQuote(asset, amount, side);
        uint256 best = _bestQuote(asset, amount, side);
        uint256 slippage = _lss(real, best);
        return
            best == 0 ? 0 :

            Quote({
                real: real,
                best: best,
                slippage: slippage
            });
    }

    function _realQuote(Asset memory asset, uint256 amount, Side side) private view returns (uint256) {
        uint8 decimals0 = asset.token.decimals();
        uint8 decimals1 = asset.currency.decimals();
        if (side == Side.TKN_CUR_PATH) {
            uint256 amountX = _toNewPrecision(amount, 18, decimals0);
            uint256[] memory amountsOutX = _quickswap.getAmountsOut(amountX, asset.tknCurPath);
            uint256 amountOutX = amountsOutX[amountsOutX.length - 1];
            return _toNewPrecision(amountOutX, decimals1, 18);
        }
        else {
            uint256 amountX = _toNewPrecision(amount, 18, decimals1);
            uint256[] memory amountsOutX = _quickswap.getAmountsOut(amountX, asset.curTknPath);
            uint256 amountOutX = amountsOutX[amountsOutX.length - 1];
            return _toNewPrecision(amountOutX, decimals0, 18);
        }
    }

    function _bestQuote(Asset memory asset, uint256 amount, Side side) private view returns (uint256) {
        IERC20 token0 = asset.token;
        IERC20 token1 = asset.currency;
        uint8 decimals0 = asset.token.decimals();
        uint8 decimals1 = asset.currency.decimals();
        if (side == Side.TKN_CUR_PATH) {
            uint256 amountX = _toNewPrecision(amount, 18, decimals0);
            Pair memory pair = _pair(token0, token1);
            return _quickswap.quote(amountX, pair.reserve0, pair.reserve1);
        }
        else {
            uint256 amountX = _toNewPrecision(amount, 18, decimals1);
            Pair memory pair = _pair(token1, token0);
            return _quickswap.quote(amountX, pair.reserve0, pair.reserve1);
        }
    }


    function _pair(IERC20 token0, IERC20 token1) private view returns (Pair memory) {
        IUniswapV2Factory factory = IUniswapV2Factory(_quickswap.factory());
        IUniswapV2Pair pair = IUniswapV2Pair(factory.getPair(address(token0), address(token1)));
        IERC20 pairToken0 = IERC20(pair.token0());
        IERC20 pairToken1 = IERC20(pair.token1());
        (uint256 reserve0, uint256 reserve1,) = pair.getReserves();
        bool sorted =
            address(token0) == address(pairToken0) &&
            address(token1) == address(pairToken1);
        if (!sorted) (reserve0, reserve1) = _sort(reserve0, reserve1);
        uint8 decimals0 = token0.decimals();
        uint8 decimals1 = token1.decimals();
        return Pair({
            pair: pair,
            token0: token0,
            token1: token1,
            reserve0: _toNewPrecision(reserve0, decimals0, 18),
            reserve1: _toNewPrecision(reserve1, decimals1, 18),
            decimals0: decimals0,
            decimals1: decimals1
        });
    }

    function _sort(uint256 x, uint256 y) private pure returns (uint256, uint256) {
        return (y, x);
    }


    function _slc(uint256 x, uint256 percentage) private pure returns (uint256) {
        return _mul(_div(x, 100e18), percentage);
    }

    function _lss(uint256 x, uint256 y) private pure returns (uint256 percentage) {
        return 100e18 - _yld(x, y);
    }

    function _yld(uint256 x, uint256 y) private pure returns (uint256 percentage) {
        return 
            x == 0 ? 0 :
            x >= y ? 100e18 : 
            _pct(x, y);
    }

    function _pct(uint256 x, uint256 y) private pure returns (uint256 percentage) {
        return _mul(_div(x, y), 100e18);
    }

    function _mul(uint256 x, uint256 y) private pure returns (uint256) {
        return _muldiv(x, y, 1e18);
    }

    function _div(uint256 x, uint256 y) private pure returns (uint256) {
        return _muldiv(x, 1e18, y);
    }

    function _toNewPrecision(uint256 x, uint8 decimals0, uint8 decimals1) private pure returns (uint256) {
        return x == 0 || decimals0 == decimals1 ? x : _muldiv(x, 10**decimals1, 10**decimals0);
    }

    function _muldiv(uint256 x, uint256 y, uint256 z) private pure returns (uint256) {
        unchecked {
            uint256 prod0;
            uint256 prod1;
            assembly {
                let mm := mulmod(x, y, not(0))
                prod0 := mul(x, y)
                prod1 := sub(sub(mm, prod0), lt(mm, prod0))
            }
            if (prod1 == 0) {
                return prod0 / z;
            }
            require(z > prod1, "overf");
            uint256 remainder;
            assembly {
                remainder := mulmod(x, y, z)
                prod1 := sub(prod1, gt(remainder, prod0))
                prod0 := sub(prod0, remainder)
            }
            uint256 twos = z & (~z + 1);
            assembly {
                z := div(z, twos)
                prod0 := div(prod0, twos)
                twos := add(div(sub(0, twos), twos), 1)
            }
            prod0 |= prod1 * twos;
            uint256 inverse = (3 * z) ^ 2;
            inverse *= 2 - z * inverse;
            inverse *= 2 - z * inverse;
            inverse *= 2 - z * inverse;
            inverse *= 2 - z * inverse;
            inverse *= 2 - z * inverse;
            inverse *= 2 - z * inverse;
            return prod0 * inverse;
        }
    }
}