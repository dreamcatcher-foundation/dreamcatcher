// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import '../../types/FixedPointValue.sol';
import '../../Mods.sol';
import '../../../non-native/openzeppelin/token/ERC20/IERC20.sol';
import '../../../non-native/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol';
import '../../../non-native/uniswap/interfaces/IUniswapV2Pair.sol';
import '../../sockets/FixedPointPureMathSocket.sol';
import '../../sockets/UniswapV2FactorySocket.sol';
import '../../sockets/UniswapV2Router02Socket.sol';
import '../Mod.sol';

interface IUniswapV2PureAdaptorMod is IMod {
    function yield(address[] memory path, FixedPointValue memory amountIn) external view returns (FixedPointValue memory asBasisPoints);
    function bestAmountOut(address[] memory path, FixedPointValue memory amountIn) external view returns (FixedPointValue memory asEther);
    function realAmountOut(address[] memory path, FixedPointValue memory amountIn) external view returns (FixedPointValue memory asEther);
    function quote(address[] memory path) external view returns (FixedPointValue memory asEther);
}

contract UniswapV2PureAdaptorMod is Mod, FixedPointPureMathSocket, UniswapV2FactorySocket, UniswapV2Router02Socket {
    error UniswapV2Adaptor__PairDoesNotExist(address[] path);
    error UniswapV2Adaptor__PairDoesNotMatchPath(address[] path, PairLayout layout);
    error UniswapV2Adaptor__PathIsLengthIsLessThan2(address[] path);
    
    enum PairLayout {
        HAS_MATCH,
        HAS_REVERSE_MATCH,
        HAS_NO_MATCH
    }

    modifier onlyIfPathLengthIsAtLeast2(address[] memory path) {
        _onlyIfPathLengthIsAtLeast2(path);
        _;
    }

    constructor(address fixedPointPureMathMod, address uniswapV2FactoryMod, address uniswapV2Router02Mod) {
        mods()[keccak256('FixedPointPureMathMod')] = fixedPointPureMathMod;
        mods()[keccak256('UniswapV2FactoryMod')] = uniswapV2FactoryMod;
        mods()[keccak256('UniswapV2RouterMod')] = uniswapV2Router02Mod;
    }

    function yield(address[] memory path, FixedPointValue memory amountIn) public view virtual onlyIfPathLengthIsAtLeast2(path) returns (FixedPointValue memory asBasisPoints) {
        return calculateYield_(bestAmountOut(path, amountIn), realAmountOut(path, amountIn));
    }

    function bestAmountOut(address[] memory path, FixedPointValue memory amountIn) public view virtual onlyIfPathLengthIsAtLeast2(path) returns (FixedPointValue memory asEther) {
        return _fixedPointPureMathSocket().asEther(_fixedPointPureMathSocket().mul(_fixedPointPureMathSocket().asEther(amountIn), quote(path)));
    }

    function realAmountOut(address[] memory path, FixedPointValue memory amountIn) public view virtual onlyIfPathLengthIsAtLeast2(path) returns (FixedPointValue memory asEther) {
        uint256[] memory amounts = _uniswapV2RouterSocket().getAmountsOut(_fixedPointPureMathSocket().asEther(amountIn).value, path);
        uint256 amount = amounts[amounts.length - 1];
        return _fixedPointPureMathSocket().asEther(FixedPointValue({value: amount, decimals: decimals1_(path)}));
    }

    function quote(address[] memory path) public view virtual onlyIfPathLengthIsAtLeast2(path) returns (FixedPointValue memory asEther) {
        if (!hasPair_(path)) {
            revert UniswapV2Adaptor__PairDoesNotExist(path);
        }
        return calculateQuote_(path, layoutOf_(path));
    }

    function calculateQuote_(address[] memory path, PairLayout layout) private view onlyIfPathLengthIsAtLeast2(path) returns (FixedPointValue memory asEther) {
        if (layout == PairLayout.HAS_MATCH) {
            return quoteLayout0_(path);
        }
        if (layout == PairLayout.HAS_REVERSE_MATCH) {
            return quoteLayout1_(path);
        }
        revert UniswapV2Adaptor__PairDoesNotMatchPath(path, layout);
    }

    function quoteLayout0_(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (FixedPointValue memory asEther) {
        uint256 result = _uniswapV2RouterSocket()
            .quote(
                10**decimals0_(path),
                reserveOf_(path)[0],
                reserveOf_(path)[1]
            );
        return _fixedPointPureMathSocket().asEther(FixedPointValue({value: result, decimals: decimals1_(path)}));  
    }

    function quoteLayout1_(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (FixedPointValue memory asEther) {
        uint256 result = _uniswapV2RouterSocket()
            .quote(
                10**decimals1_(path),
                reserveOf_(path)[1],
                reserveOf_(path)[0]
            );
        return _fixedPointPureMathSocket().asEther(FixedPointValue({value: result, decimals: decimals1_(path)}));
    }

    function calculateYield_(FixedPointValue memory bestAmountOut, FixedPointValue memory realAmountOut) private pure only2SimilarFixedPointTypes(bestAmountOut, realAmountOut) returns (FixedPointValue memory asBasisPoints) {
        if (bestAmountOut.value == 0) {
            return zeroYield_();
        }
        if (realAmountOut.value == 0) {
            return zeroYield_();
        }
        if (realAmountOut.value >= bestAmountOut.value) {
            return fullYield_();
        }
        FixedPointValue memory scale = _fixedPointPureMathSocket().scale(realAmountOut, bestAmountOut);
        return _fixedPointPureMathSocket().asEther(scale);
    }

    function zeroYield_() private pure returns (FixedPointValue memory asBasisPoints) {
        return FixedPointValue({value: 0, decimals: 18});
    }

    function fullYield_() private pure returns (FixedPointValue memory asBasisPoints) {
        return _fixedPointPureMathSocket().asEther(FixedPointValue({value: 10_000, decimals: 0}));
    }

    function layoutOf_(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (PairLayout) {
        IUniswapV2Pair pairInterface = interfaceOf_(path);
        address token0 = pairInterface.token0();
        address token1 = pairInterface.token1();
        if (token0_(path) == token0 && token1_(path) == token1) return PairLayout.HAS_MATCH;
        if (token0_(path) == token1 && token1_(path) == token0) return PairLayout.HAS_REVERSE_MATCH;
        return PairLayout.HAS_NO_MATCH;
    }

    function hasPair_(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (bool) {
        return addressOf_(path) != address(0);
    }

    function reserveOf_(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (uint256[] memory) {
        uint256[] memory reserve = new uint256[](2);
        (reserve[0], reserve[1],) = interfaceOf_(path).getReserves();
        return reserve;
    }

    function interfaceOf_(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (address) {
        return IUniswapV2Pair(addressOf_(path));
    }

    function addressOf_(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (address) {
        return _uniswapV2FactorySocket().getPair(_token0(path), _token1(path));
    }

    function decimals0_(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (uint8) {
        return IERC20Metadata(token0_(path)).decimals();
    }

    function decimals1_(address[] memory path) private view onlyIfPathLengthIsAtLeast2(path) returns (uint8) {
        return IERC20Metadata(token1_(path)).decimals();
    }

    function token0_(address[] memory path) private pure onlyIfPathLengthIsAtLeast2(path) returns (address) {
        return path[0];
    }

    function token1_(address[] memory path) private pure onlyIfPathLengthIsAtLeast2(path) returns (address) {
        return path[path.length - 1];
    }

    function onlyIfPathLengthIsAtLeast2_(address[] memory path) private pure returns (bool) {
        if (path.length < 2) {
            revert UniswapV2Adaptor__PathIsLengthIsLessThan2(path);
        }
        return true;
    }
}