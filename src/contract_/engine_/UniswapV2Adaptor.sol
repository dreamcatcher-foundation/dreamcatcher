// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IToken} from "../asset/token/IToken.sol";
import {IUniswapV2Router02} from "../import/uniswap/v2/interfaces/IUniswapV2Router02.sol";
import {IUniswapV2Factory} from "../import/uniswap/v2/interfaces/IUniswapV2Factory.sol";
import {IUniswapV2Pair} from "../import/uniswap/v2/interfaces/IUniswapV2Pair.sol";

abstract contract UniswapV2Adaptor {
    error ZeroAddress();

    struct Asset {

    }

    struct Exchange {
        IUniswapV2Router02 routerI;
        IUniswapV2Factory factoryI;
    }


    

    function _bst(string memory exchange, string memory symbol, uint256 amount) private view returns (uint256) {

    }

    function _reserve(IUniswapV2Factory factoryI, IToken tokenI0, IToken tokenI1) private view returns (uint256, uint256) {
        address token0 = address(tokenI0);
        address token1 = address(tokenI1);
        address pair = factoryI.getPair(token0, token1);
        if (token0 == token1) revert ("token 0 is token 1");
        if (token0 == address(0)) revert ("token 0 is zero address");
        if (token1 == address(0)) revert ("token 1 is zero address");
        if (pair == address(0)) revert ("pair not found");



        

        require(token0 != token1);
        require(token0 != address(0), "zero-address");
        require(token1 != address(0), "zero-address");
        require(pair != address(0), "zero-address");
        IUniswapV2Pair pairI = IUniswapV2Pair(pair);
        address pairToken0 = pairI.token0();
        address pairToken1 = pairI.token1();
        require(pairToken0 != address(0));
        require(pairToken1 != address(0));
        require(
            token0 == pairToken0 ||
            token0 == pairToken1,
            ""
        );
        require(
            token1 == pairToken0 ||
            token1 == pairToken1,
            ""
        );
        (uint256 reserve0, uint256 reserve1,) = pairI.getReserves();
        require(reserve0 != 0);
        require(reserve1 != 0);
        uint8 decimals0 = tokenI0.decimals();
        uint8 decimals1 = tokenI1.decimals();
        require(decimals0 >= 2);
        require(decimals1 >= 2);
        require(decimals0 <= 18);
        require(decimals1 <= 18);
        bool sorted =
            token0 == pairToken0 &&
            token1 == pairToken1;
        if (!sorted) (reserve0, reserve1) = _sort(reserve0, reserve1);
        return (reserve0, reserve1);
    }

    function _sort(uint256 x, uint256 y) private pure returns (uint256, uint256) {
        return (y, x);
    }
}


contract ExchangeAdaptorRouter {
    IExchangeAdaptor[] private _adaptorsI;


}

interface IExchangeAdaptor {}

contract ExchangeAdaptor {
    IUniswapV2Router02 routerI;
    IUniswapV2Factory factoryI;

}