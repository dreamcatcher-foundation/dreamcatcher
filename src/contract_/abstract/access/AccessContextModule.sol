// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {MsgContext} from "./MsgContext.sol";

abstract contract AccessContext is MsgContext {
    error AccessContext__Unauthorized();

    modifier onchain() {
        address sender = _msgSender();
        uint256 size;
        assembly {
            size := extcodesize(sender)
        }
        if (size == 0) revert AccessContext__Unauthorized();
        _;
    }

    modifier offchain() {
        address sender = _msgSender();
        uint256 size;
        assembly {
            size := extcodesize(sender)
        }
        if (size != 0) revert AccessContext__Unauthorized();
        _;
    }
}