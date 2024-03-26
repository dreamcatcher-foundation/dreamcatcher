// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import './FixedPointValueToolkit.sol';
import './ERC20Toolkit.sol';

function _getTotalSupplyUsingERC20AdaptorToolkit(address token, uint8 toDecimals) view returns (FixedPointValue memory) {
    uint8 decimals = _getDecimalsUsingERC20Toolkit(token);
    uint256 result = _getTotalSupplyUsingERC20Toolkit(token);
    FixedPointValue memory value = FixedPointValue({value: result, decimals: decimals});
    value = _getAsNewDecimalsUsingFixedPointValueToolkit(value, toDecimals);
    return value;
}

function _getBalanceOfUsingERC20AdaptorToolkit(address token, address account, uint8 toDecimals) view returns (FixedPointValue memory) {
    uint8 decimals = _getDecimalsUsingERC20Toolkit(token);
    uint256 result = _getBalanceOfUsingERC20Toolkit(token, account);
    FixedPointValue memory value = FixedPointValue({value: result, decimals: decimals});
    value = _getAsNewDecimalsUsingFixedPointValueToolkit(value, toDecimals);
    return value;
}

function _getAllowanceUsingERC20AdaptorToolkit(address token, address owner, address spender, uint8 toDecimals) view returns (FixedPointValue memory) {
    uint8 decimals = _getDecimalsUsingERC20Toolkit(token);
    uint256 result = _getAllowanceUsingERC20Toolkit(token, owner, spender);
    FixedPointValue memory value = FixedPointValue({value: result, decimals: decimals});
    value = _getAsNewDecimalsUsingFixedPointValueToolkit(value, toDecimals);
    return value;
}

function _transferUsingERC20AdaptorToolkit(address token, address to, FixedPointValue memory amount) returns (bool) {
    uint8 decimals = _getDecimalsUsingERC20Toolkit(token);
    amount = _getAsNewDecimalsUsingFixedPointValueToolkit(amount, decimals);
    uint256 value = amount.value;
    _transferUsingERC20Toolkit(token, to, value);
    return true;
}

function _transferFromUsingERC20AdaptorToolkit(address token, address from, address to, FixedPointValue memory amount) returns (bool) {
    uint8 decimals = _getDecimalsUsingERC20Toolkit(token);
    amount = _getAsNewDecimalsUsingFixedPointValueToolkit(amount, decimals);
    uint256 value = amount.value;
    _transferFromUsingERC20Toolkit(token, from, to, value);
    return true;
}

function _approveUsingERC20AdaptorToolkit(address token, address spender, FixedPointValue memory amount) returns (bool) {
    uint8 decimals = _getDecimalsUsingERC20Toolkit(token);
    amount = _getAsNewDecimalsUsingFixedPointValueToolkit(amount, decimals);
    uint256 value = amount.value;
    _approveUsingERC20Toolkit(token, spender, value);
    return true;
}