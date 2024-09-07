// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IVToken} from "../../../interface/asset/token/IVToken.sol";
import {IOwnableToken} from "../../../asset/token/ownable-token/IOwnableToken.sol";
import {IVaultFactory} from "./IVaultFactory.sol";
import {IOwnableTokenFactory} from "../../../asset/token/ownable-token/IOwnableTokenFactory.sol";
import {Asset} from "./Asset.sol";

contract VaultNode {
    event Deploy(address deployer, address instance);

    address[] private _deployed;
    address private _vaultFactory;
    address private _ownableTokenFactory;

    constructor(address vaultFactory, address ownableTokenFactory) {
        _vaultFactory = vaultFactory;
        _ownableTokenFactory = ownableTokenFactory;
    }

    function deployed() public view returns (address[] memory) {
        address[] memory deployed = new address[](_deployed.length);
        for (uint256 i = 0; i < _deployed.length; i++) {
            deployed[i] = _deployed[i];
        }
        return deployed;
    }

    function vaultFactory() public view returns (address) {
        return _vaultFactory;
    }

    function ownableTokenFactory() public view returns (address) {
        return _ownableTokenFactory;
    }

    function deploy(string memory name, string memory symbol, Asset[] memory assets) public returns (address) {
        address vToken = IOwnableTokenFactory(_ownableTokenFactory).deploy(name, symbol, address(this));
        address vault = IVaultFactory(_vaultFactory).deploy(IVToken(vToken), assets);
        IOwnableToken(vToken).transferOwnership(vault);
        _deployed.push(vault);
        emit Deploy(msg.sender, vault);
        return vault;
    }
}