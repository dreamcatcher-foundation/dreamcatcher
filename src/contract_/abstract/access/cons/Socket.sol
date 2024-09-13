// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

abstract contract X {


}

/// for contracts only
abstract contract Socket {
    error Socket__Unauthorized();

    mapping(address => bool) private _isAuthorized;

    modifier socket() {
        if (!_isAuthorized[msg.sender]) revert Socket__Unauthorized();
        _;
    }

    function _establishConnection

    function x() external virtual socket {
        
    }
}

/// for eoa
abstract contract Protected {

    address[] private _operators;

    modifier role(string memory role) {
        
        _;
    }

    function y() external virtual role("*") {

    }
}

abstract contract Sovreign {

    modifier exclusive() {
        _;
    }

    function z() external virtual exclusive() protected() socket() {

    }

}

abstract contract AccessContextLibrary {
    error AccessContext__Unauthorized();

    modifier onchain() {
        uint256 size;
        assembly {
            size := extcodesize(msg.sender)
        }
        if (size == 0) revert AccessContext__Unauthorized();
        _;
    }

    modifier offchain() {
        uint256 size;
        assembly {
            size := extcodesize(msg.sender)
        }
        if (size != 0) revert AccessContext__Unauthorized();
        _;
    }
}