// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Diamond } from "./Diamond.sol";

interface IDiamondLauncher {
    
}

contract DiamondLauncher {
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
        return address(diamond);
    }
}