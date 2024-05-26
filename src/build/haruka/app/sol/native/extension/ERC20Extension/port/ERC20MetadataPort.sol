// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "../slot/ERC20Slot.sol";

contract ERC20MetadataPort is ERC20Slot {
    function _nameOnERC20MetadataPort() internal view returns (string memory) {
        return _ERC20Slot().name;
    }

    function _symbolOnERC20MetadataPort() internal view returns (string memory) {
        return _ERC20Slot().symbol;
    }

    function _decimalsOnERC20MetadataPort() internal pure returns (uint8) {
        return 18;
    }
}