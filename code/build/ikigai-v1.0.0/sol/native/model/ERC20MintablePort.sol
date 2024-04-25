// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "./ERC20BasePort.sol";
import "./TokenSlot.sol";

contract ERC20MintablePort is ERC20BasePort, TokenSlot {
    error CannotMintToAddressZero(address account, uint256 amount);

    function _mint(address account, uint256 amount) internal returns (bool) {
        return mint_(account, amount);
    }
    
    function mint_(address account, uint256 amount) private returns (bool) {
        bool recipientIsAddressZero = account == address(0);
        if (recipientIsAddressZero) {
            revert CannotMintToAddressZero(account, amount);
        }
        _token()._totalSupply += amount;
        _token()._balances[account] += amount;
        emit Transfer(address(0), account, amount);
        return true;
    }
}