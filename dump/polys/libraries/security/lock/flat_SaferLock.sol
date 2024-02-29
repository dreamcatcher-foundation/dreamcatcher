
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\polys\libraries\security\lock\SaferLock.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: Apache-2.0
pragma solidity 0.8.19;

library SaferLock {
    struct Lock {
        bool _locked;
        uint256 _startTimestamp;
        uint256 _duration;
        bool _isTimed;
        bool _reverseOnCompletion;
        bool _resetOnCompletion;
        bool _onlyDuringTimer;
    }

    
}
