// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import '../Mods.sol';
import './SocketError.sol';
import '../mods/state/TokenStateMod.sol';

contract TokenStateSocket is SocketError, Mods {
    function _tokenStateSocket() internal view virtual returns (ITokenStateMod) {
        bytes32 socket = keccak256('ERC20StateMod'); 
        address module = mods()[socket];
        bool moduleIsMissing = module == address(0)
        if (moduleIsMissing) {
            revert SocketError__MissingModule(socket);
        }
        return ITokenStateMod(module);
    }
}