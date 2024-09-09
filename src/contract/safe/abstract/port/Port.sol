// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {Exchange} from "../../struct/Exchange.sol";
import {MissingDependency} from "../../error/Error.sol";



abstract contract Port {
    event Mount(string indexed port, address location);
    event Update();

    mapping(string => address) private _sockets;

    modifier dependency(string memory port) {
        if (_sockets[port] == 0x0000000000000000000000000000000000000000) revert MissingDependency(port);
        _;
    }

    constructor() {}

    function _mountDependency(string memory port, address location) internal returns (address) {
        return _sockets[port] = location;
    }
}