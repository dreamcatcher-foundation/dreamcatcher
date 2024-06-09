// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IDisk {
    event Migration(address implementation);

    function implementation() external view returns (address);
    function migrate(address implementation) external returns (bool);
    function freeze() external returns (bool);
}