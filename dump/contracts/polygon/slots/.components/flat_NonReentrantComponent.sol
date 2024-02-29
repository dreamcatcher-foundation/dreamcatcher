
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\contracts\polygon\slots\.components\NonReentrantComponent.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

library NonReentrantComponent {
    struct NonReentrant {
        bool _locked;
    }

    function locked(NonReentrant storage nonReentrant) internal view returns (bool) {
        return nonReentrant._locked;
    }

    function lock(NonReentrant storage nonReentrant) internal returns (bool) {
        _lock(nonReentrant);
        return true;
    }

    function unlock(NonReentrant storage nonReentrant) internal returns (bool) {
        _unlock(nonReentrant);
        return true;
    }

    function _lock(NonReentrant storage nonReentrant) private returns (bool) {
        nonReentrant._locked = true;
        return true;
    }

    function _unlock(NonReentrant storage nonReentrant) private returns (bool) {
        nonReentrant._locked = false;
        return true;
    }
}
