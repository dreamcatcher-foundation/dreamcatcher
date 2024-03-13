// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../../../non-native/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import "../../../non-native/uniswap/interfaces/IUniswapV2Factory.sol";
import "../../../non-native/uniswap/interfaces/IUniswapV2Router02.sol";
import "../../../non-native/uniswap/interfaces/IUniswapV2Pair.sol";
import "../math/UintConversionMathLib.sol";
import "./TokenAddressAdaptorLib.sol";

library UniswapV2PairAdaptorLib {
    using UintConversionMathLib for uint256;
    using TokenAddressAdaptorLib for address;

    struct Payload {
        address token0;
        address token1;
        address uniswapV2Factory;
        address uniswapV2Router;
    }
    
    function asV2PairAddress(Payload memory payload) internal view returns (address) {
        return IUniswapV2Factory(payload.uniswapV2Factory).getPair(payload.token0, payload.token1);
    }

    function asV2PairInterface(Payload memory payload) internal view returns (IUniswapV2Pair) {
        return IUniswapV2Pair(asV2PairAddress(payload));
    }

    function reserves(Payload memory payload) internal view returns (uint256[] memory response) {
        response = new uint256[](2);
        (response[0], response[1],) = asV2PairInterface(payload).getReserves();
        return response;
    }

    function isZeroV2PairAddress(Payload memory payload) internal view returns (bool) {
        return asV2PairAddress(payload) == address(0);
    }

    function isSameLayoutAsV2PairInterface(Payload memory payload) internal view returns (bool) {
        return payload.token0 == asV2PairInterface(payload).token0();
    }

    function priceR64(Payload memory payload) internal view returns (uint256 r64) {
        if (isZeroV2PairAddress(payload)) {
            return 0;
        }
        if (isSameLayoutAsV2PairInterface(payload)) {
            return IUniswapV2Router02(payload.uniswapV2Router)
                .quote(
                    10 ** IERC20Metadata(payload.token0).decimals(),
                    reserves(payload)[0],
                    reserves(payload)[1]
                )
                .asR64(IERC20Metadata(payload.token1).decimals());
        }
        return IUniswapV2Router02(payload.uniswapV2Router)
            .quote(
                10 ** IERC20Metadata(payload.token1).decimals(),
                reserves(payload)[1],
                reserves(payload)[0]
            )
            .asR64(IERC20Metadata(payload.token1).decimals());
    }

    struct PathPayload {
        address[] path;
        address uniswapV2Factory;
        address uniswapV2Router;
        uint256 amountInR64;
    }

    function amountOutR64(PathPayload memory payload) internal view returns (uint256 r64) {
        uint256[] memory amounts = IUniswapV2Router02(payload.uniswapV2Router)
            .getAmountsOut(
                payload.amountInR64.asR(IERC20Metadata(payload.path[0]).decimals()),
                payload.path
            );
        return amounts[amounts.length - 1].asR64(IERC20Metadata(payload.path[payload.path.length - 1]).decimals());
    }

    function slippage(PathPayload memory payload) internal view returns (uint256 asBasisPoint) {
        Payload memory basePayload;
        basePayload.token0 = payload.path[0];
        basePayload.token1 = payload.path[payload.path.length - 1];
        basePayload.uniswapV2Factory = payload.uniswapV2Factory;
        basePayload.uniswapV2Router = payload.uniswapV2Router;
        uint256 bestAmountOutR64 = payload.amountInR64 * priceR64(basePayload);
        uint256 realAmountOutR64 = amountOutR64(payload);
        return ((realAmountOutR64 - bestAmountOutR64) / bestAmountOutR64) * 10000;
    }

    function swap(PathPayload memory payload) internal returns (uint256 r64) {
        payload.path[0].approveR64(payload.uniswapV2Router, 0);
        payload.path[0].approveR64(payload.uniswapV2Router, payload.amountInR64);
        uint256[] memory amounts = IUniswapV2Router02(payload.uniswapV2Router)
            .swapExactTokensForTokens(
                payload.amountInR64
                    .asR(IERC20Metadata(payload.path[0]).decimals()),
                amountOutR64(payload)
                    .asR(IERC20Metadata(payload.path[payload.path.length - 1]).decimals()),
                payload.path,
                address(this),
                block.timestamp
            );
        return amounts[amounts.length - 1]
            .asR64(IERC20Metadata(payload.path[payload.path.length - 1]).decimals());
    }

    struct PathWithSlippagePayload {
        address[] path;
        address uniswapV2Factory;
        address uniswapV2Router;
        uint256 amountInR64;
        uint256 maximumSlippageAsBasisPoint;
    }

    function swapWithSlippageCheck(PathWithSlippagePayload memory payload) internal returns (uint256 r64) {
        PathPayload memory pathPayload;
        pathPayload.path = payload.path;
        pathPayload.uniswapV2Factory = payload.uniswapV2Factory;
        pathPayload.uniswapV2Router = payload.uniswapV2Router;
        pathPayload.amountInR64 = payload.amountInR64;
        require(slippage(pathPayload) <= payload.maximumSlippageAsBasisPoint, "UniswapV2PairAdaptorLib: maximum slippage exceeded");
        return swap(pathPayload);
    }
}
