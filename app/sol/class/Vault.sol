// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { EnumerableSet } from "../import/openzeppelin/utils/structs/EnumerableSet.sol";

library VaultLib {
    using EnumerableSet for EnumerableSet.AddressSet;
    
    struct Vault {
        Inner inner;    
    }

    struct Inner {
        
    }
}