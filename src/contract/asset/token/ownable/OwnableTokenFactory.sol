// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IOwnableTokenFactory} from "./IOwnableTokenFactory.sol";
import {Factory} from "../../../factory/Factory.sol";
import {FactoryReceipt} from "../../../factory/FactoryReceipt.sol";
import {OwnableToken} from "./OwnableToken.sol";

contract OwnableTokenFactory is IOwnableTokenFactory, Factory {
    
    constructor() Factory() {}

    function forge(string memory name, string memory symbol, address owner) public virtual {
        return _issueReceipt(address(new OwnableToken(name, symbol, owner)));
    }
}