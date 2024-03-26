// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "../../non-native/openzeppelin/utils/math/Math.sol";

struct FixedPointValue {
    uint256 value; 
    uint8 decimals;
}