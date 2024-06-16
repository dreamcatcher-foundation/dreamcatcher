// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { EnumerableSet } from "../../imports/openzeppelin/utils/structs/EnumerableSet.sol";

struct AuthSl {
    mapping(string => EnumerableSet.AddressSet) _members;
}