// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "./TokenSlot.sol";

contract ERC20MetadataPort is TokenSlot {
    function _name() internal view returns (string memory) {
        return _token()._name;
    }

    function _symbol() internal view returns (string memory) {
        return _token()._symbol;
    }

    function _decimals() internal pure returns (uint8) {
        return 18;
    }
}