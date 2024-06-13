// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { EnumerableSet } from "../../import/openzeppelin/utils/structs/EnumerableSet.sol";

struct Role {
    address[] members;
}

struct Auth {
    Inner inner;
}

struct Inner {
    mapping(string => EnumerableSet.AddressSet) membersOf;
}