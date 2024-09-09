// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IToken} from "../../../../asset/token/IToken.sol";
import {KernelFixedPointEngine} from "../math/KernelFixedPointEngine.sol";

library KernelErc20Engine is KernelFixedPointEngine {
    
    function _transfer(IToken token, address account, uint256 amount) internal {
        uint8 decimals = token.decimals();
        uint256 amountX = _cst(amount, 18, decimals);
        bool success = token.transfer(account, amountX);
        require(success);
        return;
    }

    function _transferFrom(IToken token, address from, address to, uint256) internal {
        
    }
}