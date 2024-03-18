// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

library ReentrancyGuardStorageLib {
    error REENTRANT_CALL();

    struct ReentrancyGuard {
        uint8 status_;
    }

    function nonReentrantBefore(ReentrancyGuard storage reentrancyGuard) internal {
        if (reentrancyGuard.status_ != _NOT_ENTERED()) {
            revert REENTRANT_CALL();
        }
        reentrancyGuard.status_ = ENTERED_();
    }

    function nonReentrantAfter(ReentrancyGuard storage reentrancyGuard) internal {
        reentrancyGuard.status_ = NOT_ENTERED_();
    }

    function NOT_ENTERED_() private pure returns (uint8) {
        return 1;
    }

    function ENTERED_() private pure returns (uint8) {
        return 2;
    }
}