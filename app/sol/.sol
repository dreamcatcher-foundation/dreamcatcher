// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct FixedPointValue {
    uint256 value;
    uint8 decimals;
}

interface IFixedPointMath {
    function toDecimals(FixedPointValue memory number, uint8 decimals) internal pure returns (FixedPointValue memory) {
        uint8 decimals0 = number.decimals;
        uint8 decimals1 = decimals;
        uint256 representation0 = _representation(decimals0);
        uint256 representation1 = _representation(decimals1);
        uint256 value = number.value;
        uint256 result = value.mulDiv(representation1, representation0);
        return FixedPointValue({ value: result, decimals: decimals });
    }
}

contract FixedPointMath {

}


enum UniswapV2PairLayout {
    IsMatch,
    IsReverseMatch,
    IsNotMatch
}

contract UniswapV2Pair {
    error InvalidUniswapV2PairLayout();

    IUniswapV2Router02 private _router;
    IUniswapV2Factory private _factory;
    IFixedPointMath private _fixedPointMathLibrary;
    IUniswapV2Pair private _pair;
    address[8] private _path;

    constructor(address[] memory path, IUniswapV2Router02 router, IUniswapV2Factory factory, IFixedPointMath fixedPointMathLibrary) {
        _assignPath(path);
        _router = router;
        _factory = factory;
        _fixedPointMathLibrary = fixedPointMathLibrary;
        _pair = IUniswapV2Pair(factory().getPair(firstToken(), lastToken()));

        if (address(pair()) == address(0)) {
            revert("");
        }
        
        if (quote().value == 0) {
            revert("");
        }
    }



    function quote() public view returns (FixedPointValue memory r18) {
        if (_pairLayout() == UniswapV2PairLayout.IsMatch) {
            return _quote0();
        }
        if (_pairLayout() == UniswapV2PairLayout.IsReverseMatch) {
            return _quote1();
        }
        revert InvalidUniswapV2PairLayout();
    }

    function pair() public view returns (IUniswapV2Pair) {
        return _pair;
    }


    function factory() {}



    function reserves() public view returns (uint256[] memory) {
        uint256[] memory reserves = new uint256[](2);
        (
            reserves[0],
            reserves[1],
        ) = _pairInterface().getReserves();
        return reserves;
    }

    function firstTokenDecimals() public view returns (uint8) {
        return IERC20Metadata(firstToken()).decimals();
    }

    function lastTokenDecimals() public view returns (uint8) {
        return IERC20Metadata(lastToken()).decimals();
    }

    function firstToken() public view returns (address) {
        return _path[0];
    }

    function lastToken() public view returns (address) {
        return _path[_path.length - 1];
    }

    function _quote0() private view returns (FixedPointValue memory r18) {
        uint256 result = _router.quote(
            10**firstTokenDecimals(),
            reserves()[0],
            reserves()[1]
        );
        return fixedPointMathLibrary().toEther(FixedPointValue({ value: result, decimals: lastTokenDecimals() }));
    }

    function _quote1() private view returns (FixedPointValue memory r18) {
        uint256 result = _router.quote(
            10**lastTokenDecimals(),
            reserves()[1],
            reserves()[0]
        );
        return fixedPointMathLibrary().toEther(FixedPointValue({ value: result, decimals: lastTokenDecimals() }));
    }

    function _pairLayout() private view returns (UniswapV2PairLayout) {
        if (
            firstToken() == _pairInterface().token0() &&
            lastToken() == _pairInterface().token1()
        ) {
            return UniswapV2PairLayout.IsMatch;
        }
        if (
            firstToken() == _pairInterface().token1() &&
            lastToken() == _pairInterface().token0()
        ) {
            return UniswapV2PairLayout.IsNotMatch;
        }
        return UniswapV2PairLayout.IsNotMatch;
    }

    function _pairInterface() private view returns (IUniswapV2Pair) {
        return IUniswapV2Pair(_pairAddress());
    }

    function _pairAddress() private view returns (address) {
        return _factory.getPair(firstToken(), lastToken());
    }

    function _assignPath(address[] memory path) private returns (bool) {
        for (uint256 i = 0; i < _path.length; i += 1) {
            _path.push(path);
        }
        return true;
    }
}