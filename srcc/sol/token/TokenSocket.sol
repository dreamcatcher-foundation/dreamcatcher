// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Socket } from "../Socket.sol";
import { ITokenDisk } from "./ITokenDisk.sol";

contract TokenSocket is Socket {
    function _tokenSocket() internal onlyIfSocketIsInstalled("disk.token") returns (ITokenDisk memory) {
        return ITokenDisk(_socket()["disk.token"]);
    }
}