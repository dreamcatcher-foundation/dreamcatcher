// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

abstract contract Protected {
    event Protected__OwnershipTransferred(address oldOwner, address newOwner);
    event Protected__Claimed();
    error Protected__Unauthorized();
    error Protected__IllegalClaim();
    address private _owner;

    modifier protected() {
        if (msg.sender != owner()) revert Protected__Unauthorized();
        _;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function claim() public virtual {
        if (owner() != address(0)) revert Protected__IllegalClaim();
        _transferOwnership(msg.sender);
        emit Protected__Claimed();
        return;
    }

    function tranferOwnership(address account) public virtual protected {
        _transferOwnership(account);
        return;
    }

    function renounceOwnership() public virtual protected {
        _transferOwnership(address(0));
        return;
    }

    function _transferOwnership(address account) internal virtual {
        address oldOwner = owner();
        address newOwner = account;
        _owner = account;
        emit Protected__OwnershipTransferred(oldOwner, newOwner);
        return;
    }
}