// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

abstract contract EnvironmentAccessContext {
    error AccessContext__Unauthorized();

    modifier onchain() {
        address sender = _sender();
        uint256 size;
        assembly {
            size := extcodesize(sender)
        }
        if (size == 0) revert AccessContext__Unauthorized();
        _;
    }

    modifier offchain() {
        address sender = _sender();
        uint256 size;
        assembly {
            size := extcodesize(sender)
        }
        if (size != 0) revert AccessContext__Unauthorized();
        _;
    }

    function _sender() private view returns (address) {
        return msg.sender;
    }
}