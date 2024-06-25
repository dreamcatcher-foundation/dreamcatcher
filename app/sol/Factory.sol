// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

contract Factory {
    event Deployment(address addr);
    
    // ie. hex"6960ff60005260206000f3600052600a6016f3"
    function _deploy(bytes memory bytecode) internal payable returns (address) {
        address addr = address(0);
        assembly {
            addr := create(0, add(bytecode, 0x20), 0x13)
        }
        // return address 0 on error
        require(addr != address(0), "FAILED_DEPLOYMENT");
        emit Deployment(addr);
        return addr;
    }
}