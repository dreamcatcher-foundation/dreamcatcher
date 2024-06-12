// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { EnumerableSet } from "../../../import/openzeppelin/utils/structs/EnumerableSet.sol";

struct Router {
    mapping(string => EnumerableSet.AddressSet) _versions;
}