// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IOwnable} from "./IOwnable.sol";

abstract contract Ownable is IOwnable {
    error Ownable__Unauthorized();

    address private _owner;

    constructor(address owner) {
        _owner = owner;
    }

    modifier onlyowner() {
        _onlyOwner();
        _;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function renounceOwnership() public virtual onlyowner {
        _transferOwnership(address(0));
        return;
    }

    function transferOwnership(address owner) public virtual onlyowner {
        
    }

    function _transferOwnership(address owner_) internal virtual {
        address oldOwner = owner();
        address newOwner = owner_;
        _owner = owner_;
        emit OwnershipTransferred(oldOwner, newOwner);
        return;
    }

    function _onlyOwner() private view {
        if (msg.sender != owner()) revert Ownable__Unauthorized();
        return;
    }
}