// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IErc20 } from "../../../interface/standard/IErc20.sol";

struct Asset {
    IErc20 token;
    IErc20 currency;
    address[] tknCurPath;
    address[] curTknPath;
    uint256 targetAllocation;
}