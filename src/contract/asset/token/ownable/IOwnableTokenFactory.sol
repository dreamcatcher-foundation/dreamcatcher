// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IFactory} from "../../../factory/IFactory.sol";

interface IOwnableTokenFactory is IFactory {
    function forge(string memory name, string memory symbol, address owner) external;
}