// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IOwnable {
    function owner() external view returns (address);
    function renounceOwnership() external;
    function transferOwnership() external;
}

abstract contract Ownable {
    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);
    error Unauthorized();

    address private _owner;

    modifier onlyowner() {

        _;
    }

    

    function _transferOwnership(address owner) internal virtual {
        address oldOwner = _owner;
        address newOwner = owner;
        _owner = owner;
        emit OwnershipTransferred(oldOwner, newOwner);
        return;
    }
}