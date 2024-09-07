// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IVToken} from "../../../interface/asset/token/IVToken.sol";
import {IOwnableToken} from "../../../asset/token/ownable-token/IOwnableToken.sol";
import {IVaultFactory} from "./IVaultFactory.sol";
import {IOwnableTokenFactory} from "../../../asset/token/ownable-token/IOwnableTokenFactory.sol";
import {Asset} from "./Asset.sol";

contract VaultNode {
    event Deploy(address deployer, address instance);

    struct Child {
        address deployer;
        address instance;
        uint256 timestamp;
    }

    Child[] private _children;
    address private _vaultFactory;
    address private _ownableTokenFactory;

    constructor(address vaultFactory, address ownableTokenFactory) {
        _vaultFactory = vaultFactory;
        _ownableTokenFactory = ownableTokenFactory;
    }

    function children() public view returns (Child[] memory) {
        Child[] memory children = new Child[](_children.length);
        for (uint256 i = 0; i < _children.length; i++) {
            children[i].deployer = _children[i].deployer;
            children[i].instance = _children[i].instance;
            children[i].timestamp = _children[i].timestamp;
        }
        return children;
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
        _children.push(Child({
            deployer: msg.sender,
            instance: vault,
            timestamp: block.timestamp
        }));
        emit Deploy(msg.sender, vault);
        return vault;
    }
}