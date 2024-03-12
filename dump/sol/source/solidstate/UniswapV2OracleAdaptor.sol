// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../imports/uniswap/interfaces/IUniswapV2Factory.sol";
import "../imports/uniswap/interfaces/IUniswapV2Pair.sol";
import "../imports/uniswap/interfaces/IUniswapV2Router02.sol";
import "../imports/openzeppelin/token/ERC20/IERC20.sol";
import "../imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";

library Math {
    /**
    * decimals 18 => ?
     */
    fromEtherDecimalsToAnyDecimals(uint number, uint8 decimals) internal pure returns (uint) {
        return ((number * (10 ** 18) / (10 ** 18)) * (10 ** decimals)) / (10 ** 18);
    }

    /**
    * decimals ? => 18
     */
    fromAnyDecimalsToEtherDecimals(uint number, uint8 decimals) internal pure returns (uint) {
        return ((number * (10 ** 18) / (10 ** decimals)) * (10 ** 18)) / (10 ** 18);
    }
}

interface IToken is IERC20Metadata, IERC20 {}

contract UniswapV2OracleAdaptor {
    using Math for uint;

    IUniswapV2Factory private _factory;

    IUniswapV2Router02 private _router;

    function factory() public view returns (address) {
        return address(_factory);
    }

    function router() public view returns (address) {
        return address(_router);
    }

    function quote(address[2] memory tokens) public view returns (uint) {
        IToken[2] memory tkns;
        tkns[0] = IToken(tokens[0]);
        tkns[1] = IToken(tokens[1]);
        uint8[] decimals;
        decimals[0] = tkns[0].decimals();
        decimals[1] = tkns[1].decimals();
        address pair = _factory.getPair(tokens[0], tokens[1]);
        if (pair == address(0)) {
            return 0;
        }
        IUniswapV2Pair pair_ = IUniswapV2Pair(pair);
        uint[] res;
        (res[0], res[1]) = pair_.getReserves();
        if (tokens[0] == pair_.token0()) {
            uint amount = 10 ** decimals[0];
     
        }
    } 
}