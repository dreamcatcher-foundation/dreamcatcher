// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

abstract contract MsgContext {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}