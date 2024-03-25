// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import '../Mods.sol';
import './SocketError.sol';
import '../../non-native/uniswap/interfaces/IUniswapV2Router02.sol';

contract UniswapV2Router02Socket is SocketError, Mods {
    function _uniswapV2Router02Socket() internal view virtual returns (IUniswapV2Router02) {
        bytes32 socket = keccak256('UniswapV2Router02Mod');
        address module = mods()[socket];
        bool moduleIsMissing = module == address(0);
        if (moduleIsMissing) {
            revert SocketError__MissingModule(socket);
        }
        return IUniswapV2Router02(module);
    }
}