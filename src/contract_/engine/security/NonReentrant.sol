// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

abstract contract NonReentrant {
    error Reentrant(address);

    uint8 immutable private _T = 1;
    uint8 immutable private _F = 0;
    uint8 private _locked;

    constructor() {
        _locked = _F;
    }

    modifier nonreentrant() {
        _0();
        _;
        _1();
    }

    function _reentrant() internal view virtual returns (bool) {
        if (_locked == _T) return true;
        if (_locked == _F) return false;
        return false;
    }

    function _0() private {
        if (_reentrant()) revert Reentrant(msg.sender);
        _locked = _T;
        return;
    }

    function _1() private {
        _locked = _F;
        return;
    }
}