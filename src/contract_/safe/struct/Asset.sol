// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IToken} from "../asset/token/IToken.sol";

struct Asset {
    IToken tkn;
    IToken cur;
    address[] tknCurPath;
    address[] curTknPath;
    uint256 targetAllocation;
}