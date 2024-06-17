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

    enum Layout {
        IsMatch,
        IsReverseMatch,
        IsUnrecognized
    }

    IUniswapV2Router02 constant private _QUICKSWAP_ROUTER = IUniswapV2Router02(0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff);
    IUniswapV2Factory constant private _QUICKSWAP_FACTORY = IUniswapV2Factory(0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32);
    uint256 constant private _PATH_SIZE_LIMIT = 8;
    address[] private _path;
    uint256 private _targetAllocationPercentage;

    constructor(address[] memory path) Ownable(msg.sender) {
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
    }

    function quote() public view returns (uint256) {
        if (_layout() == Layout.IsMatch) {
            return _quote0();
        }
        if (_layout() == Layout.IsReverseMatch) {
            return _quote1();
        }
        revert UnrecognizedLayout();
    }

    function _quote0() private view returns (uint256) {
        return _toEther(_QUICKSWAP_ROUTER.quote(
            10**_decimals0(),
            _reserves()[0],
            _reserves()[1]
        ), _decimals0());
    }

    function _quote1() private view returns (uint256) {
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