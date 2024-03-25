// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import '../Mods.sol';
import './SocketError.sol';
import '../../non-native/uniswap/interfaces/IUniswapV2Factory.sol';

contract UniswapV2FactorySocket is SocketError, Mods {
    function _uniswapV2FactorySocket() internal view virtual returns (IUniswapV2Factory) {
        bytes32 socket = keccak256('UniswapV2FactoryMod');
        address module = mods()[socket];
        bool moduleIsMissing = module == address(0);
        if (moduleIsMissing) {
            revert SocketError__MissingModule(socket);
        }
        return IUniswapV2Factory(module);
    }
}