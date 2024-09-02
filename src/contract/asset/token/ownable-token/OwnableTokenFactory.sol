// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {OwnableToken} from "./OwnableToken.sol";

contract OwnableTokenFactory {
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

    function deploy(string memory name, string memory symbol, address owner) public returns (address) {
        address instance = address(new OwnableToken(name, symbol, owner));
        _deployed.push(instance);
        emit Deploy(msg.sender, instance);
        return instance;
    }
}