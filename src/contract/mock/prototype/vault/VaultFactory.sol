// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IVToken} from "../../../interface/asset/token/IVToken.sol";
import {Asset} from "./Asset.sol";
import {Vault} from "./Vault.sol";

contract VaultFactory {
    event Deploy(address deployer, address instance);

    address[] private _deployed;

    constructor() {}

    function deployed() public view returns (address[] memory) {
        address[] memory deployed = new address[](_deployed.length);
        for (uint256 i = 0; i < _deployed.length; i++) {
            deployed[i] = _deployed[i];
        }
        return deployed;
    }

    function deploy(IVToken vToken, Asset[] memory assets) public returns (address) {
        address instance = address(new Vault(vToken, assets));
        _deployed.push(instance);
        emit Deploy(msg.sender, instance);
        return instance;
    }
}