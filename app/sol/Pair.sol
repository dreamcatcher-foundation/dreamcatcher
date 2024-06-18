// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IUniswapV2Router02 } from "./imports/uniswap/interfaces/IUniswapV2Router02.sol";
import { IUniswapV2Factory } from "./imports/uniswap/interfaces/IUniswapV2Factory.sol";
import { IUniswapV2Pair } from "./imports/uniswap/interfaces/IUniswapV2Pair.sol";
import { IERC20 } from "./imports/openzeppelin/token/ERC20/IERC20.sol";
import { IERC20Metadata } from "./imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { FixedPointCalculator } from "./FixedPointCalculator.sol";
import { Ownable } from "./imports/openzeppelin/access/Ownable.sol";

interface IPairFactory {
    function deploy(address[] memory path, uint256 targetAllocation) public returns (address);
}

contract PairFactory {
    constructor() {}

    function deploy(address[] memory path, uint256 targetAllocation) public returns (address) {
        Pair pair = new Pair(path, targetAllocation);
        pair.transferOwnership(msg.sender);
        return address(pair);
    }
}

interface IPair {
    function targetAllocation() external view returns (uint256 percentage);
    function sellSidePath() external view returns (address[] memory);
    function buySidePath() external view returns (address[] memory);
    function bestAssets() external view returns (uint256);
    function realAssets() external view returns (uint256);
    function sellSideYield(uint256 amountIn) external view returns (uint256);
    function buySideYield(uint256 amountIn) external view returns (uint256);
    function bestSellSideAmountOut(uint256 amountIn) external view returns (uint256);
    function bestBuySideAmountOut(uint256 amountIn) external view returns (uint256);
    function realSellSideAmountOut(uint256 amountIn) external view returns (uint256);
    function realBuySideAmountOut(uint256 amountIn) external view returns (uint256);
    function sellSideQuote() external view returns (uint256);
    function buySideQuote() external view returns (uint256);
    function sell(uint256 amountIn) external returns (uint256);
    function buy(uint256 amountIn) external returns (uint256);
}

contract Pair is Ownable, FixedPointCalculator {
    event Purchase(uint256 amountIn, uint256 amountOut);
    event Sale(uint256 amountIn, uint256 amountOut);

    error PathCannotBeShorterThan2();
    error PathCannotBeLongerThan10();
    error UnrecognizedLayout();
    error PairIsWorthless();
    error InsufficientYield();
    error PairNotFound();

    enum Layout {
        IsMatch,
        IsReverseMatch,
        IsUnrecognized
    }

    IUniswapV2Router02 constant private _QUICKSWAP_ROUTER = IUniswapV2Router02(0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff);
    IUniswapV2Factory constant private _QUICKSWAP_FACTORY = IUniswapV2Factory(0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32);
    uint256 constant private _MIN_YIELD = 90000000000000000000; // 10% slippage
    uint256 constant private _PATH_SIZE_LIMIT = 10;
    address[] private _path;
    uint256 private _targetAllocation;

    constructor(address[] memory path, uint256 targetAllocation) Ownable(msg.sender) {
        uint256 size = path.length;
        if (size < 2) {
            revert PathCannotBeShorterThan2();
        }
        if (size > _PATH_SIZE_LIMIT) {
            revert PathCannotBeLongerThan10();
        }
        for (uint256 i = 0; i < size; i += 1) {
            _path.push(path[i]);
        }
        if (address(_interface()) == address(0)) {
            revert PairNotFound();
        }
        if (sellSideQuote() == 0) {
            revert PairIsWorthless();
        }
        _targetAllocation = targetAllocation;
    }

    function targetAllocation() public view returns (uint256 percentage) {
        return _targetAllocation;
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

    function bestAssets() public view returns (uint256) {
        uint256 balance = IERC20(_token0()).balanceOf(owner());
        if (balance == 0) {
            return 0;
        }
        balance = _toEther(balance, _decimals0());
        return bestSellSideAmountOut(balance);
    }

    function realAssets() public view returns (uint256) {
        uint256 balance = IERC20(_token0()).balanceOf(owner());
        if (balance == 0) {
            return 0;
        }
        balance = _toEther(balance, _decimals0());
        return realSellSideAmountOut(balance);
    }

    function sellSideYield(uint256 amountIn) public view returns (uint256) {
        uint256 best = bestSellSideAmountOut(amountIn);
        uint256 real = realSellSideAmountOut(amountIn);
        return _yield(real, best, 18, 18);
    }

    function buySideYield(uint256 amountIn) public view returns (uint256) {
        uint256 best = bestBuySideAmountOut(amountIn);
        uint256 real = realBuySideAmountOut(amountIn);
        return _yield(real, best, 18, 18);
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
        /** -> Temporary fix */
        uint256 result = _toEther(amount, _decimals1());
        if (result >= bestSellSideAmountOut(amountIn)) {
            return bestSellSideAmountOut(amountIn);
        }
        return result;
    }

    function realBuySideAmountOut(uint256 amountIn) public view returns (uint256) {
        uint256[] memory amounts = _QUICKSWAP_ROUTER.getAmountsOut(amountIn, buySidePath());
        uint256 amount = amounts[amounts.length - 1];
        /** -> Temporary fix */
        uint256 result = _toEther(amount, _decimals0());
        if (result >= bestBuySideAmountOut(amountIn)) {
            return bestBuySideAmountOut(amountIn);
        }
        return result;
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

    function buySideQuote() public view returns (uint256) {
        if (_layout() == Layout.IsMatch) {
            return _buySideQuote0();
        }
        if (_layout() == Layout.IsReverseMatch) {
            return _buySideQuote1();
        }
        revert UnrecognizedLayout();
    }

    function sell(uint256 amountIn) public onlyOwner() returns (uint256) {
        IERC20(_token0()).transferFrom(owner(), address(this), _toNewDecimals(amountIn, 18, _decimals0()));
        if (sellSideYield(amountIn) < _MIN_YIELD) {
            revert InsufficientYield();
        }
        IERC20(_token0()).approve(address(_QUICKSWAP_ROUTER), 0);
        IERC20(_token0()).approve(address(_QUICKSWAP_ROUTER), _toNewDecimals(amountIn, 18, _decimals0()));
        uint256 amountInConverted = _toNewDecimals(amountIn, 18, _decimals0());
        uint256[] memory amounts = _QUICKSWAP_ROUTER.swapExactTokensForTokens(amountInConverted, 0, sellSidePath(), owner(), block.timestamp);
        uint256 amount = amounts[amounts.length - 1];
        uint256 amountOut = _toEther(amount, _decimals1());
        emit Sale(amountIn, amountOut);
        return amountOut;

    }

    function buy(uint256 amountIn) public onlyOwner() returns (uint256) {
        IERC20(_token1()).transferFrom(owner(), address(this), _toNewDecimals(amountIn, 18, _decimals1()));
        if (buySideYield(amountIn) < _MIN_YIELD) {
            revert InsufficientYield();
        }
        IERC20(_token1()).approve(address(_QUICKSWAP_ROUTER), 0);
        IERC20(_token1()).approve(address(_QUICKSWAP_ROUTER), _toNewDecimals(amountIn, 18, _decimals1()));
        uint256 amountInConverted = _toNewDecimals(amountIn, 18, _decimals1());
        uint256[] memory amounts = _QUICKSWAP_ROUTER.swapExactTokensForTokens(amountInConverted, 0, buySidePath(), owner(), block.timestamp);
        uint256 amount = amounts[amounts.length - 1];
        uint256 amountOut = _toEther(amount, _decimals0());
        emit Purchase(amountIn, amountOut);
        return amountOut;
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

    function _buySideQuote0() private view returns (uint256) {
        return _toEther(_QUICKSWAP_ROUTER.quote(
            10**_decimals1(),
            _reserves()[1],
            _reserves()[0]
        ), _decimals0());
    }

    function _buySideQuote1() private view returns (uint256) {
        return _toEther(_QUICKSWAP_ROUTER.quote(
            10**_decimals0(),
            _reserves()[0],
            _reserves()[1]
        ), _decimals0());
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