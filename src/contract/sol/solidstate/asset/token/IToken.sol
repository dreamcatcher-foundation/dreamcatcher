// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IErc20} from "./erc20/IErc20.sol";
import {IErc20Metadata} from "./erc20/IErc20Metadata.sol";

interface IToken is IErc20, IErc20Metadata {}