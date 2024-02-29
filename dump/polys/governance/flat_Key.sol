
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\polys\governance\Key.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity 0.8.19;
////import "contracts/polygon/abstract/proxy/FoundationImplementation.sol";
////import "contracts/polygon/abstract/utils/LowLevelCall.sol";

contract Key is FoundationImplementation, LowLevelCall {



    function lowLevelCall(address target, bytes memory data) public virtual returns (bytes memory) {
        _onlyOwner();
        return _lowLevelCall(target, data);
    }

    
}
