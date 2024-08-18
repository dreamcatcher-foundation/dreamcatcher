// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IVaultFactory } from "./IVaultFactory.sol";
import { Vault } from "./Vault.sol";

contract VaultFactory {

    address[] private _deployed;

    function deployed() public view returns (address[] memory) {
        address[] memory x = new address[](_deployed.length);
        for (uint256 i = 0; i < _deployed.length; i++) {
            x[i] = _deployed[i];
        }
        return x;
    }

    function Vault(address vToken) public returns (address) {
        
    }
}