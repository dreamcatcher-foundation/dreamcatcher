// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Vault } from "./Vault.sol";

contract VaultSlot {
    bytes32 constant internal _VAULT_SLOT = bytes32(uint256(keccak256("eip1976.vault")) - 1);

    function _vault() internal pure returns (Vault storage layout) {
        bytes32 slot = _VAULT_SLOT;
        assembly {
            layout.slot := slot
        }
    }
}