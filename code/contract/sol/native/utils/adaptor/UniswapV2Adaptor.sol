// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import { IERC20 } from "../../../non-native/openzeppelin/token/ERC20/IERC20.sol";
import { IERC20Metadata } from "../../../non-native/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { IUniswapV2Factory } from "../../../non-native/uniswap/interfaces/IUniswapV2Factory.sol";
import { IUniswapV2Router02 } from "../../../non-native/uniswap/interfaces/IUniswapV2Router02.sol";
import { IUniswapV2Pair } from "../../../non-native/uniswap/interfaces/IUniswapV2Pair.sol";
import { FixedPointValue } from "../../shared/FixedPointValue.sol";
import { FixedPointMath } from "../math/FixedPointMath.sol";

contract UniswapV2Adaptor is FixedPointMath {
    IUniswapV2Factory private _factory;
    IUniswapV2Router02 private _router;

    error PairDoesNotMatchPath(address[] memory path, PairLayout layout);
    error PairDoesNotExist(address[] memory path);
    error InvalidPath(address[] memory path);

    enum PairLayout {
        MATCH,
        REVERSE_MATCH,
        NO_MATCH
    }

    modifier onlyValidPath(address[] memory path) {
        if (path.length < 2) {
            revert InvalidPath(path);
        }
        _;
    }

    constructor(address factory, address router) {
        _factory = IUniswapV2Factory(factory);
        _router = IUniswapV2Router02(router);
    }

    function factory() public view returns (IUniswapV2Factory) {
        return _factory;
    }

    function router() public view returns (IUniswapV2Router02) {
        return _router;
    }

    function yield(address[] memory path, FixedPointValue memory amountIn) public view onlyValidPath(path) returns (FixedPointValue memory basisPoints) {
        return _calculateYield(bestAmountOut(path, amountIn), realAmountOut(path, amountIn));
    }

    function bestAmountOut(address[] memory path, FixedPointValue memory amountIn) public view onlyValidPath(path) returns (FixedPointValue memory asEther) {
        return asEther(mul(asEther(amountIn), quote(path)));
    }

    function realAmountOut(address[] memory path, FixedPointValue memory amountIn) public view onlyValidPath(path) returns (FixedPointValue memory asEther) {
        uint256[] memory amounts = router().getAmountsOut(asEther(amountIn).value, path);
        uint256 amount = amounts[amounts.length - 1];
        return asEther(FixedPointValue({value: amount, decimals: _decimals1(path)}));
    }

    function quote(address[] memory path) public view onlyValidPath(path) returns (FixedPointValue memory asEther) {
        if (!_hasPair(path)) {
            revert PairDoesNotExist(path);
        }
        return _calculateQuote(path, _layoutOf(path));
    }

    function _calculateQuote(address[] memory path, PairLayout layout) internal view onlyValidPath(path) returns (FixedPointValue memory asEther) {
        if (layout == PairLayout.MATCH) {
            return _quoteLayout0(path);
        }
        if (layout == PairLayout.REVERSE_MATCH) {
            return _quoteLayout1(path);
        }
        revert PairDoesNotMatchPath(path, layout);
    }

    function _quoteLayout0(address[] memory path) internal view onlyValidPath(path) returns (FixedPointValue memory asEther) {
        uint256 result = router()
            .quote(
                10**_decimals0(path),
                _reserveOf(path)[0],
                _reserveOf(path)[1]
            );
        return asEther(FixedPointValue({value: result, decimals: _decimals1(path)}));
    }

    function _quoteLayout1(address[] memory path) internal view onlyValidPath(path) returns (FixedPointValue memory asEther) {
        uint256 result = router()
            .quote(
                10**_decimals1(path),
                _reserveOf(path)[1],
                _reserveOf(path)[0]
            );
        return asEther(FixedPointValue({value: result, decimals: _decimals1(path)})); 
    }

    function _calculateYield(FixedPointValue memory bestAmountOut, FixedPointValue memory realAmountOut) internal pure onlyMatchingFixedPointValueType(bestAmountOut, realAmountOut) returns (FixedPointValue memory asBasisPoints) {
        if (bestAmountOut.value == 0) {
            return _zeroYield();
        }
        if (realAmountOut.value == 0) {
            return _zeroYield();
        }
        if (realAmountOut.value >= bestAmountOut.value) {
            return _fullYield();
        }
        return asEther(scale(realAmountOut, bestAmountOut));
    }

    function _zeroYield() internal view returns (FixedPointValue memory asBasisPoints) {
        return FixedPointValue({value: 0, decimals: 18}); 
    }

    function _fullYield() internal view returns (FixedPointValue memory asBasisPoints) {
        return asEther(FixedPointValue({value: 10_000, decimals: 0}));
    }

    function _addressOf(address[] memory path) internal view onlyValidPath(path) returns (address) {
        address token0 = path[0];
        address token1 = path[path.length - 1];
        return factory().getPair(token0, token1);
    }

    function _interfaceOf(address[] memory path) internal view onlyValidPath(path) returns (IUniswapV2Pair) {
        return IUniswapV2Pair(_addressOf(path));
    }

    function _reserveOf(address[] memory path) internal view onlyValidPath(path) returns (uint256[] memory) {
        uint256[] memory reserve = new uint256[](2);
        (reserve[0], reserve[1],) = _interfaceOf(path).getReserves();
        return reserve;
    }

    function _layoutOf(address[] memory path) internal view onlyValidPath(path) returns (PairLayout) {
        address pairInterface = _interfaceOf(path);
        address tkn0 = pairInterface.token0();
        address tkn1 = pairInterface.token1();
        address token0 = path[0];
        address token1 = path[path.length - 1];
        if (token0 == tkn0 && token1 == tkn1) return PairLayout.MATCH;
        if (token0 == tkn1 && token1 == tkn0) return PairLayout.REVERSE_MATCH;
        return PairLayout.NO_MATCH;
    }

    function _hasPair(address[] memory path) internal view onlyValidPath(path) returns (bool) {
        return _addressOf(path) != address(0);
    }

    function _decimals0(address[] memory path) internal view onlyValidPath(path) returns (uint8) {
        return IERC20Metadata(path[0]).decimals();
    }

    function _decimals1(address[] memory path) internal view onlyValidPath(path) returns (uint8) {
        return IERC20Metadata(path[path.length - 1]).decimals();
    }
}