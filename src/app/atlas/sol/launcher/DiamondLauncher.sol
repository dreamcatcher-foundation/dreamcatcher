// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { ILauncher } from "./ILauncher.sol";
import { Diamond } from "../solidstate/Diamond.sol";

contract DiamondLauncher is ILauncher {
    error Unauthorized();

    address private _owner;

    constructor(address owner) {
        _owner = owner;
    }

    function transferOwnership(address owner) external returns (address) {
        if (msg.sender != _owner) {
            revert Unauthorized();
        }
        return _owner = owner;
    }

    function launch() external override returns (address) {
        if (msg.sender != _owner) {
            revert Unauthorized();
        }
        Diamond diamond = new Diamond();
        diamond.transferOwnership(_owner);
        address launched = address(diamond);
        emit Launch(launched);
        return launched;
    }
}