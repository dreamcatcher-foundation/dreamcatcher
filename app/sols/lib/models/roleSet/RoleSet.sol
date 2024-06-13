// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Role } from "../role/Role.sol";

struct RoleSet {
    mapping(string => Role) _roles;
}