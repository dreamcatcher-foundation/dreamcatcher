// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IOwnableToken } from "../OwnableToken.sol";

struct Gas {
    IOwnableToken token;
    address recipient;
    uint256 amount;
}

contract VendorEngine is Payable {
    Gas private _gas;

    constructor(address token, address recipient, address amount) {
        _setGasToken(token);
        _setGasRecipient(recipient);
        _setGasCost(amount);
    }

    function _setGasToken(address token)
    internal {
        _gas.token = token;
    }

    function _setGasRecipient(address recipient)
    internal {
        _gas.recipient = recipient;
    }

    function _setGasCost(uint256 amount)
    internal {
        _gas.amount = amount;
    }

    modifier gas() {
        _process();
        _;
    }

    function _process()
    private {
        _gas.token.transferFrom(msg.sender, _gas.recipient, _gas.amount);
    }
}


contract _VendorEnginePayableShard {
    modifier payment(address tokenIn, uint256 amountIn) {
        _process(tokenIn, amountIn);
        _;
    }

    function _process(address tokenIn, uint256 amountIn) 
    private {
        uint8 decimals = IERC20Metadata(tokenIn).decimals();
        uint256 callerBalanceExo = IERC20(tokenIn).balanceOf(msg.sender);
        uint256 callerBalance = _cast(callerBalanceExo, decimals, 18);
        require(amountIn <= callerBalance, "VendorEngine: INSUFFICIENT_CALLER_BALANCE");
        uint256 amountInExo = _cast(amountIn, 18, decimals);
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountInExo);
    }
}