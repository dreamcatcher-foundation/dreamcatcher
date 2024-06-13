// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Safe } from "./Safe.sol";

library SafeLib {

    function tokens(Safe storage safe, uint256 key) internal view returns (address) {
        return safe.inner.tokens.at(key);
    }

    function tokens(Safe storage safe) internal view returns (address[] memory) {
        return safe.inner.tokens.values();
    }

    
}