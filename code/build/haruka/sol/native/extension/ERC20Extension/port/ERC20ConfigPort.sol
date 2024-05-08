// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "../slot/ERC20Slot.sol";

contract ERC20ConfigPort is ERC20Slot {
    event ERC20ConfigOnERC20ConfigPort(string name, string symbol);

    function _configOnERC20ConfigPort(address memory name, string memory symbol) internal returns (bool) {
        _ERC20Slot().name = name;
        _ERC20Slot().symbol = symbol;
        emit ERC20ConfigOnERC20ConfigPort(name, symbol);
        return true;
    }
}