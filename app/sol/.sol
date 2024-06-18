// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IUniswapV2Router02 } from "./imports/uniswap/interfaces/IUniswapV2Router02.sol";
import { IUniswapV2Factory } from "./imports/uniswap/interfaces/IUniswapV2Factory.sol";
import { IUniswapV2Pair } from "./imports/uniswap/interfaces/IUniswapV2Pair.sol";
import { IERC20 } from "./imports/openzeppelin/token/ERC20/IERC20.sol";
import { IERC20Metadata } from "./imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { FixedPointCalculator } from "./FixedPointCalculator.sol";
import { Ownable } from "./imports/openzeppelin/access/Ownable.sol";

contract Asset is Ownable, FixedPointCalculator {
    error PathMustHaveAtLeastTwoTokens();
    error PathIsTooLong();
    error UnrecognizedLayout();
    error PairNotFound();
    error PairIsWorthless();
    error InsufficientYield();

    enum Layout {
        IsMatch,
        IsReverseMatch,
        IsUnrecognized
    }

    IUniswapV2Router02 constant private _QUICKSWAP_ROUTER = IUniswapV2Router02(0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff);
    IUniswapV2Factory constant private _QUICKSWAP_FACTORY = IUniswapV2Factory(0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32);
    uint256 constant private _MIN_YIELD = 97500000000000000000;
    uint256 constant private _PATH_SIZE_LIMIT = 8;
    address[] private _path;
    uint256 private _targetAllocationPercentage;

    constructor(address[] memory path, uint256 targetAllocationPercentage) Ownable(msg.sender) {
        uint256 size = path.length;
        if (size < 2) {
            revert PathMustHaveAtLeastTwoTokens();
        }
        if (size > _PATH_SIZE_LIMIT) {
            revert PathIsTooLong();
        }
        for (uint256 i = 0; i < size; i += 1) {
            _path.push(path[i]);
        }
        if (address(_interface()) == address(0)) {
            revert PairNotFound();
        }
        if (quote() == 0) {
            revert PairIsWorthless();
        }
        _targetAllocationPercentage = targetAllocationPercentage;
    }

    function buy(uint256 amountIn) public onlyOwner() returns (uint256) {

    }

    function sell(uint256 amountIn) public onlyOwner() returns (uint256) {
        IERC20(_token0()).transferFrom(owner(), address(this), amountIn);
        if (yield(amountIn) < _MIN_YIELD) {
            revert InsufficientYield();
        }
        IERC20(_token0()).approve(address(_QUICKSWAP_ROUTER), 0);
        IERC20(_token0()).approve(address(_QUICKSWAP_ROUTER), _toNewDecimals(amountIn, _decimals0(), 18));
        uint256[] memory amounts = _QUICKSWAP_ROUTER.swapExactTokensForTokens(_toNewDecimals(amountIn, _decimals0(), 18), realAmountOut(amountIn), sellSidePath(), msg.sender, block.timestamp);
        uint256 amount = amounts[amounts.length - 1];
        return _toEther(amount, _decimals1());
    }

    function sellSidePath() public view returns (address[] memory) {
        address[] memory result = new address[](_path.length);
        for (uint256 i = 0; i < _path.length; i += 1) {
            result[i] = _path[i];
        }
        return result;
    }

    function buySidePath() public view returns (address[] memory) {
        address[] memory result = new address[](_path.length);
        for (uint256 i = 0; i < _path.length; i += 1) {
            result[i] = _path[_path.length - 1 - i];
        }
        return result;
    }

    function targetAllocationPercentage() public view returns (uint256 percentage) {
        return _targetAllocationPercentage;
    }

    function bestAssets() public view returns (uint256) {
        uint256 balance = IERC20(_token0()).balanceOf(owner());
        if (balance == 0) {
            return 0;
        }
        balance = _toEther(balance, _decimals0());
        return bestAmountOut(balance);
    }

    function realAssets() public view returns (uint256) {
        uint256 balance = IERC20(_token0()).balanceOf(owner());
        if (balance == 0) {
            return 0;
        }
        balance = _toEther(balance, _decimals0());
        return realAmountOut(balance);
    }

    function yield(uint256 amountIn) public view returns (uint256) {
        uint256 best = bestSellSideAmountOut(amountIn);
        uint256 real = bestSellSideAmountOut(amountIn);
        return _yield(real, best, 18, 18);
    }

    function buySideYield() {
        
    }

    function bestSellSideAmountOut(uint256 amountIn) public view returns (uint256) {
        return _mul(amountIn, sellSideQuote(), 18, 18);
    }

    function bestBuySideAmountOut(uint256 amountIn) public view returns (uint256) {
        return _mul(amountIn, buySideQuote(), 18, 18);
    }

    function realSellSideAmountOut(uint256 amountIn) public view returns (uint256) {
        uint256[] memory amounts = _QUICKSWAP_ROUTER.getAmountsOut(amountIn, sellSidePath());
        uint256 amount = amounts[amounts.length - 1];
        return _toEther(amount, _decimals1());
    }

    function realBuySideAmountOut(uint256 amountIn) public view returns (uint256) {
        uint256[] memory amounts = _QUICKSWAP_ROUTER.getAmountsOut(amountIn, buySidePath());
        uint256 amount = amounts[amounts.length - 1];
        return _toEther(amount, _decimals0());
    }

    function buySideQuote() public view returns (uint256) {
        if (_layout() == Layout.IsMatch) {
            return _buySideQuote1();
        }
        if (_layout() == Layout.IsReverseMatch) {
            return _buySideQuote0();
        }
        revert UnrecognizedLayout();
    }

    function sellSideQuote() public view returns (uint256) {
        if (_layout() == Layout.IsMatch) {
            return _sellSideQuote0();
        }
        if (_layout() == Layout.IsReverseMatch) {
            return _sellSideQuote1();
        }
        revert UnrecognizedLayout();
    }

    function _buySideQuote0() private view returns (uint256) {
        return _toEther(_QUICKSWAP_ROUTER.quote(
            10**_decimals0(),
            _reserves()[0],
            _reserves()[1]
        ), _decimals0());
    }

    function _buySideQuote1() private view returns (uint256) {
        return _toEther(_QUICKSWAP_ROUTER.quote(
            10**_decimals1(),
            _reserves()[1],
            _reserves()[0]
        ), _decimals0());
    }

    function _sellSideQuote0() private view returns (uint256) {
        return _toEther(_QUICKSWAP_ROUTER.quote(
            10**_decimals0(),
            _reserves()[0],
            _reserves()[1]
        ), _decimals1());
    }

    function _sellSideQuote1() private view returns (uint256) {
        return _toEther(_QUICKSWAP_ROUTER.quote(
            10**_decimals1(),
            _reserves()[1],
            _reserves()[0]
        ), _decimals1());   
    }

    function _reserves() private view returns (uint256[] memory) {
        uint256[] memory reserves = new uint256[](2);
        (reserves[0], reserves[1],) = _interface().getReserves();
        return reserves;
    }    

    function _layout() private view returns (Layout) {
        if (
            _token0() == _interface().token0() &&
            _token1() == _interface().token1()
        ) {
            return Layout.IsMatch;
        }
        if (
            _token0() == _interface().token1() &&
            _token1() == _interface().token0()
        ) {
            return Layout.IsReverseMatch;
        }
        return Layout.IsUnrecognized;
    }

    function _interface() private view returns (IUniswapV2Pair) {
        return IUniswapV2Pair(_QUICKSWAP_FACTORY.getPair(_token0(), _token1()));
    }

    function _decimals0() private view returns (uint8) {
        return IERC20Metadata(_token0()).decimals();
    }

    function _decimals1() private view returns (uint8) {
        return IERC20Metadata(_token1()).decimals();
    }

    function _token0() private view returns (address) {
        return _path[0];
    }

    function _token1() private view returns (address) {
        return _path[_path.length - 1];
    }
}