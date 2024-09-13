// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {Math} from "./Math.sol";

struct Token {
    address account;
}

function TokenImpl(address account) pure returns (Token memory) {
    return Token({account: account});
}

library TokenLibrary {

    
}