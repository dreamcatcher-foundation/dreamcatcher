// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import '../Mods.sol';
import './SocketError.sol';
import '../mods/pure/FixedPointPureMathMod.sol';

contract FixedPointPureMathSocket is SocketError, Mods {
    function _fixedPointPureMathSocket() internal view virtual returns (IFixedPointPureMathMod) {
        bytes32 socket = keccak256('FixedPointPureMathMod');
        address module = mods()[socket];
        bool moduleIsMissing = module == address(0);
        if (moduleIsMissing) {
            revert SocketError__MissingModule(socket);
        }
        return IFixedPointPureMathMod(module);
    }
}