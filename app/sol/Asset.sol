// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IUniswapV2Router02 } from "./imports/uniswap/interfaces/IUniswapV2Router02.sol";
import { IUniswapV2Factory } from "./imports/uniswap/interfaces/IUniswapV2Factory.sol";
import { IUniswapV2Pair } from "./imports/uniswap/interfaces/IUniswapV2Pair.sol";
import { IERC20 } from "./imports/openzeppelin/token/ERC2O/IERC20.sol";
import { IERC20Metadata } from "./imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { Ownable } from "./imports/openzeppelin/access/Ownable.sol";
import { FixedPointValue } from "./imports/libraries/fixedPoint/FixedPointValue.sol";
import { FixedPointLibrary } from "./imports/libraries/fixedPoint/FixedPointLibrary.sol";

contract Asset is Ownable {
    using FixedPointLibrary for FixedPointValue;

    error PathSizeIsLessThanTwo();
    error PathSizeTooLarge();
    error PairNotFound();
    error UnrecognizedPairLayout();
    error PairIsWorthless();

    enum Layout {
        IsMatch,
        IsReverseMatch,
        IsUnrecognized
    }

    IUniswapV2Router02 constant internal _QUICKSWAP_ROUTER = IUniswapV2Router02(0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff);
    IUniswapV2Factory constant internal _QUICKSWAP_FACTORY = IUniswapV2Factory(0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32);
    uint256 constant internal _PATH_SIZE_LIMIT = 8;
    address[] internal _path;

    constructor(address[] memory path) Ownable(msg.sender) {
        uint256 size = path.length;
        if (size < 2) {
            revert PathSizeIsLessThanTwo();
        }
        if (size > _PATH_SIZE_LIMIT) {
            revert PathSizeTooLarge();
        }
        address firstToken = path[0];
        address lastToken = path[size - 1];
        address pair = _QUICKSWAP_FACTORY.getPair(firstToken, lastToken);
        if (pair == address(0)) {
            revert PairNotFound();
        }
        for (uint256 i = 0; i < size; i += 1) {
            _path.push(path[i]);
        }
        if (quote() == FixedPointValue({ value: 0, decimals: 18 })) {
            revert PairIsWorthless();
        }
    }

    function yield(FixedPointValue memory amountIn) public view returns (FixedPointValue memory percentageAsEther) {
        FixedPointValue memory best = bestAmountOut(amountIn);
        FixedPointValue memory real = realAmountOut(amountIn);
        return real.yield(best);
    }

    function bestAssets() public view returns (FixedPointValue memory asEther) {
        FixedPointValue memory balance = FixedPointLibrary.balanceOfAsEther(IERC20(_path[0]), owner());
        return bestAmountOut(balance);
    }

    function realAssets() public view returns (FixedPointValue memory asEther) {
        FixedPointValue memory balance = FixedPointLibrary.balanceOfAsEther(IERC20(_path[0]), owner());
        return realAmountOut(balance);
    }

    function bestAmountOut(FixedPointValue memory amountIn) public view returns (FixedPointValue memory asEther) {
        return amountIn.convertToEtherDecimals().mul(quote());
    }

    function realAmountOut(FixedPointValue memory amountIn) public view returns (FixedPointValue memory asEther) {
        uint256[] memory amounts = _QUICKSWAP_ROUTER.getAmountsOut(amountIn.convertToEtherDecimals().value, _path);
        uint256 amount = amounts[amounts.length - 1];
        return FixedPointValue({ value: amount, decimals: IERC20Metadata(_path[_path.length - 1]).decimals() }).convertToEtherDecimals();
    }

    function quote() public view returns (FixedPointValue memory asEther) {
        if (_layout() == Layout.IsMatch) {
            return _quote0();
        }
        if (_layout() == Layout.IsReverseMatch) {
            return _quote1();
        }
        revert UnrecognizedPairLayout();
    }

    function _quote0() private view returns (FixedPointValue memory asEther) {
        uint256 result = _QUICKSWAP_ROUTER.quote(
            10**IERC20Metadata(_path[0]).decimals(),
            _reserves()[0],
            _reserves()[1]
        );
        return FixedPointValue({ value: result, decimals: IERC20Metadata(_path[0]).decimals() }).convertToEtherDecimals();
    }

    function _quote1() private view returns (FixedPointValue memory asEther) {
        uint256 result = _QUICKSWAP_ROUTER.quote(
            10**IERC20Metadata(_path[_path.length - 1]).decimals(),
            _reserves()[1],
            _reserves()[0]
        );
        return FixedPointValue({ value: result, decimals: IERC20Metadata(_path[_path.length - 1]).decimals() }).convertToEtherDecimals();
    }

    function _reserves() private view returns (uint256[] memory) {
        IUniswapV2Pair pair = IUniswapV2Pair(_QUICKSWAP_FACTORY.getPair(_path[0], _path[_path.length - 1]));
        uint256[] memory reserves = new uint256[](2);
        (
            reserves[0],
            reserves[1],
        ) = pair.getReserves();
        return reserves;
    }

    function _layout() private view returns (Layout) {
        IUniswapV2Pair pair = IUniswapV2Pair(_QUICKSWAP_FACTORY.getPair(_path[0], _path[_path.length - 1]));
        if (
            _path[0] == pair.token0() &&
            _path[_path.length - 1] == pair.token1()
        ) {
            return Layout.IsMatch;
        }
        if (
            _path[0] == pair.token1() &&
            _path[_path.length - 1] == pair.token0()
        ) {
            return Layout.IsReverseMatch;
        }
        return Layout.IsUnrecognized;
    }
}