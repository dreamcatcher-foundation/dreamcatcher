// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IOwnable {
    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);
    function owner() external view returns (address);
    function renounceOwnership() external;
    function transferOwnership(address account) external;
}