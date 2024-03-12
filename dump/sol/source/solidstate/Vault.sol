// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../imports/openzeppelin/token/ERC20/IERC20.sol";
import "../imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import "../imports/openzeppelin/utils/structs/EnumerableSet.sol";

interface IToken is IERC20, IERC20Metadata {}

contract Vault {
    using EnumerableSet for EnumerableSet.AddressSet;

    EnumerableSet.AddressSet private _tokenContractsBeingTracked;
    address private _admin;

    constructor() {}

    function tokenContractsBeingTracked(uint index) public view returns (address) {
        return _tokenContractsBeingTracked.at(index);
    }

    
}