// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

library ReentrancyGuardStorageLibrary {
    struct ReentrancyGuard {
        uint8 status_;
    }

    function nonReentrantBefore_(ReentrancyGuard storage reentrancyGuard) internal {
        if (reentrancyGuard.status_ != __NOT_ENTERED()) {
            revert("ReentrancyGuardStorageLib: reentrant call");
        }
        reentrancyGuard.status_ = ENTERED_();
    }

    function nonReentrantAfter_(ReentrancyGuard storage reentrancyGuard) internal {
        reentrancyGuard.status_ = NOT_ENTERED_();
    }

    function __NOT_ENTERED() private pure returns (uint8) {
        return 1;
    }

    function NOT_ENTERED_() private pure returns (uint8) {
        return 1;
    }

    function ENTERED_() private pure returns (uint8) {
        return 2;
    }
}