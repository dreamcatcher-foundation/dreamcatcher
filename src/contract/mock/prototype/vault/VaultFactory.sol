// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IVaultFactory} from "./IVaultFactory.sol";
import {IOwnableTokenFactory} from "../../../asset/token/ownable-token/IOwnableTokenFactory.sol";
import {IVToken} from "../../../interface/asset/token/IVToken.sol";
import {Asset} from "./Asset.sol";
import {Vault} from "./Vault.sol";

contract VaultFactory {
    event Deploy(address deployer, address instance);

    address[] private _deployed;
    address private _ownableTokenFactory;

    constructor(address ownableTokenFactory) {
        _ownableTokenFactory = ownableTokenFactory;
    }

    function ownableTokenFactory() public view returns (address) {
        return _ownableTokenFactory;
    }

    function deployed() public view returns (address[] memory) {
        address[] memory x = new address[](_deployed.length);
        for (uint256 i = 0; i < _deployed.length; i++) {
            x[i] = _deployed[i];
        }
        return x;
    }

    function deploy(IVToken vToken, Asset[] memory assets) public returns (address) {
        address vault = address(new Vault(vToken, assets));
        _deployed.push(vault);
        emit Deploy(msg.sender, vault);
        return vault;
    }
}