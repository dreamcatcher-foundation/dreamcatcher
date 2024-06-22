// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

contract NonReentrant {
    error Reentrant();

    bool private _locked = Lock.UNLOCKED;

    modifier nonReentrant() {
        _before();
        _;
        _after();
    }

    function _before()
    private {
        if (_locked) {
            revert Reentrant();
        }
        _locked = true;
    }

    function _after()
    private {
        _locked = false;
    }
}