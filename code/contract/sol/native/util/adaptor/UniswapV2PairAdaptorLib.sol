// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../../../non-native/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import "../../../non-native/uniswap/interfaces/IUniswapV2Factory.sol";
import "../../../non-native/uniswap/interfaces/IUniswapV2Router02.sol";
import "../../../non-native/uniswap/interfaces/IUniswapV2Pair.sol";
import "../math/UintConversionMathLib.sol";
import "./TokenAddressAdaptorLib.sol";

library UniswapV2PairAdaptorLib {
    using UintConversionMathLib for uint;
    using TokenAddressAdaptorLib for address;

    struct Payload {
        address token0;
        address token1;
        address uniswapV2Factory;
        address uniswapV2Router;
    }
    
    /**
     * @dev Converts token addresses to the corresponding Uniswap V2 pair address.
     * @param payload The payload containing token and Uniswap V2 factory/router addresses.
     * @return address The address of the Uniswap V2 pair.
     */
    function asV2PairAddress(Payload payload) internal view returns (address) {
        return IUniswapV2Factory(payload.uniswapV2Factory).getPair(payload.token0, payload.token1);
    }

    /**
     * @dev Retrieves the Uniswap V2 pair interface for the given token pair.
     * @param payload The payload containing token and Uniswap V2 factory/router addresses.
     * @return IUniswapV2Pair The Uniswap V2 pair interface.
     */
    function asV2PairInterface(Payload payload) internal view returns (IUniswapV2Pair) {
        return IUniswapV2Pair(asV2PairAddress(payload));
    }

    /**
     * @dev Retrieves the reserves of the Uniswap V2 pair.
     * @param payload The payload containing token and Uniswap V2 factory/router addresses.
     * @return response An array containing the reserves of token0 and token1.
     */
    function reserves(Payload payload) internal view returns (uint[] memory response) {
        resposne = new uint[](2);
        (response[0], response[1],) = asV2PairInterface(
            payload.token0,
            payload.token1,
            payload.uniswapV2Factory
        ).getReserves();
        return response;
    }

    /**
     * @dev Checks if the Uniswap V2 pair address is zero.
     * @param payload The payload containing token and Uniswap V2 factory/router addresses.
     * @return bool A boolean indicating if the pair address is zero.
     */
    function isZeroV2PairAddress(Payload payload) internal view returns (bool) {
        return asV2PairAddress(payload) == address(0);
    }

    /**
     * @dev Checks if the given payload token addresses match the pair's layout.
     * @param payload The payload containing token and Uniswap V2 factory/router addresses.
     * @return bool A boolean indicating if the token addresses match the pair's layout.
     */
    function isSameLayoutAsV2PairInterface(Payload payload) internal view returns (bool) {
        return payload.token0 == asV2PairInterface(payload).token0();
    }

    /**
     * @dev Calculates the price ratio between token0 and token1 in the Uniswap V2 pair.
     * @param payload The payload containing token and Uniswap V2 factory/router addresses.
     * @return r64 The price ratio between token0 and token1 in Dreamcatcher native r64 representation.
     */
    function priceR64(Payload payload) internal view returns (uint r64) {
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
        uint amountInR64;
    }

    /**
     * @dev Calculates the amount of tokens to receive given an input amount and path.
     * @param payload The payload containing token path and Uniswap V2 router address.
     * @return r64 The amount of tokens to receive in Dreamcatcher native r64 representation.
     */
    function amountOutR64(PathPayload payload) internal view returns (uint r64) {
        uint[] memory amounts = IUniswapV2Router02(payload.uniswapV2Router)
            .getAmountsOut(
                payload.amountInR64.asR(IERC20Metadata(payload.path[0]).decimals()),
                payload.path
            );
        return amounts[amounts.length - 1].asR64(path[path.length - 1].decimals());
    }

    /**
     * @dev Calculates the slippage percentage for a given swap path.
     * @param payload The payload containing token path, factory/router addresses, and input amount.
     * @return asBasisPoint The slippage percentage in basis points.
     */
    function slippage(PathPayload payload) internal view returns (uint asBasisPoint) {
        Payload basePayload;
        basePayload.token0 = payload.path[0];
        basePayload.token1 = payload.path[payload.path.length - 1];
        basePayload.uniswapV2Factory = payload.uniswapV2Factory;
        basePayload.uniswapV2Router = payload.uniswapV2Router;
        uint bestAmountOutR64 = payload.amountInR64 * priceR64(basePayload);
        uint realAmountOutR64 = amountOutR64(payload);
        return ((realAmountOutR64 - bestAmountOutR64) / bestAmountOutR64) * 10000;
    }

    /**
     * @dev Executes a token swap.
     * @param payload The payload containing token path, factory/router addresses, and input amount.
     * @return r64 The amount of tokens received in Dreamcatcher native r64 representation.
     */
    function swap(PathPayload payload) internal view returns (uint r64) {
        payload.path[0].approveR64(payload.uniswapV2Router, 0);
        payload.path[0].approveR64(payload.uniswapV2Router, payload.amountInR64);
        uint[] memory amounts = IUniswapV2Router02(payload.uniswapV2Router)
            .swapExactTokensForTokens(
                payload.amountInR64
                    .asR(IERC20Metadata(payload.path[0]).decimals()),
                amountOutR64(payload)
                    .asR(IERC20Metadata(payload.path[payload.path.length - 1]).decimals()),
                payload.path,
                address(this),
                block.timestamp
            );
        return amoutns[amounts.length - 1]
            .r64(IERC20Metadata(payload.path[payload.path.length - 1]).decimals());
    }

    struct PathWithSlippagePayload {
        address[] path;
        address uniswapV2Factory;
        address uniswapV2Router;
        uint amountInR64;
        uint maximumSlippageAsBasisPoint;
    }

    /**
     * @dev Executes a token swap with slippage check.
     * @param payload The payload containing token path, factory/router addresses, input amount, and maximum slippage.
     * @return r64 The amount of tokens received in Dreamcatcher native r64 representation.
     */
    function swapWithSlippageCheck(PathWithSlippagePayload payload) internal view returns (uint r64) {
        PathPayload pathPayload;
        pathPayload.path = payload.path;
        pathPayload.uniswapV2Factory = payload.uniswapV2Factory;
        pathPayload.uniswapV2Router = payload.uniswapV2Router;
        pathPayload.amountInR64 = payload.amountInR64;
        require(slippage(pathPayload) <= payload.maximumSlippageAsBasisPoint, "UniswapV2PairAdaptorLib: maximum slippage exceeded");
        return swap(pathPayload);
    }
}
