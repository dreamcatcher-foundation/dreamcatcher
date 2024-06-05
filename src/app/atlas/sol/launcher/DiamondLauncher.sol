// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { ILauncher } from "./ILauncher.sol";
import { Diamond } from "../Diamond.sol";

contract DiamondLauncher is ILauncher {
    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);

    error Unauthorized();

    address private _owner;

    constructor(address owner) {
        _owner = owner;
    }

    function transferOwnership(address owner) external returns (address oldOwner, address newOwner) {
        _onlyOwner();
        oldOwner = _owner;
        newOwner = _owner = owner;
        emit OwnershipTransferred(oldOwner, newOwner);
        return (oldOwner, newOwner);
    }

    function launch() external override returns (address) {
        _onlyOwner();
        Diamond diamond = new Diamond();
        diamond.transferOwnership(_owner);
        address launched = address(diamond);
        emit Launch(launched);
        return launched;
    }

    function _onlyOwner() private view returns (bool) {
        if (msg.sender != _owner) {
            revert Unauthorized();
        }
        return true;
    }
}