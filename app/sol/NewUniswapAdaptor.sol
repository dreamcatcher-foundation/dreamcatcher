// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IERC20 } from "../imports/openzeppelin/token/ERC20/IERC20.sol";
import { IERC20Metadata } from "../imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";

contract ThirdPartyBroker {
    modifier thirdPartySwap(address router, address tokenIn, uint256 amountIn) {
        uint8 decimals = IERC
    }
}

contract UniswapAdaptor {



    function _quote(address router, uint256 amountIn, uint256 reserve0, uint256 reserve1) private pure returns (uint256, string memory) {
        require(router != address(0), "UniswapAdaptor._quote ROUTER_IS_ZERO_ADDRESS");
        require(amountIn != 0, "UniswapAdaptor._quote AMOUNT_IN_CANNOT_BE_ZERO");
        require(reserve0 != 0 && reserve1 != 0, "INSUFFICIENT_LIQUIDITY");
        
    }
}