// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { ILauncher } from "./ILauncher.sol";

contract DiamondLauncher is ILauncher {
    error Unauthorized();

    address private _admin;

    constructor(address admin) {
        _admin = admin;
    }

    function launch() external view returns (address) {
        if (msg.sender != _admin) {
            revert Unauthorized();
        }
        Diamond diamond = new Diamond();
        diamond.transferOwnership(_admin);
        return address(diamond);
    }
}