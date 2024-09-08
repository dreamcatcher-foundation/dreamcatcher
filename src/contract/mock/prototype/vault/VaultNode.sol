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
    }

    Child[] private _children;
    address private _vaultFactory;
    address private _ownableTokenFactory;

    constructor(address vaultFactory, address ownableTokenFactory) {
        _vaultFactory = vaultFactory;
        _ownableTokenFactory = ownableTokenFactory;
    }

    function size() public view returns (uint256) {
        return _children.length;
    }

    function child(uint256 i) public view returns (Child memory) {
        return Child({
            deployer: _children[i].deployer,
            instance: _children[i].instance
        });
    }

    function vaultFactory() public view returns (address) {
        return _vaultFactory;
    }

    function ownableTokenFactory() public view returns (address) {
        return _ownableTokenFactory;
    }

    function mint(string memory name, string memory symbol, Asset[] memory assets) public returns (address) {
        address vToken = IOwnableTokenFactory(_ownableTokenFactory).deploy(name, symbol, address(this));
        address vault = IVaultFactory(_vaultFactory).deploy(IVToken(vToken), assets);
        IOwnableToken(vToken).transferOwnership(vault);
        _children.push(Child({
            deployer: msg.sender,
            instance: vault
        }));
        emit Deploy(msg.sender, vault);
        return vault;
    }
}