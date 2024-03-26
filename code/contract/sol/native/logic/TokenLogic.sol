// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import '../Mods.sol';

contract TokenLogic is Mods {

    function _name() internal view returns (string memory) {
        return _state().name();
    }

    function _state() private view returns (address) {

    }
}