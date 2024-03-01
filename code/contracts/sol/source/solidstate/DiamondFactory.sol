// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../client/Diamond.sol";
import "./ERC20/DREAM.sol";

contract DiamondFactory {
    address[] deployed;
    IDREAM dreamToken;

    constructor(address dream) {
        dreamToken = IDREAM(dream);
    }

    function fee() public view returns (uint) {
        return 1000;
    }
}