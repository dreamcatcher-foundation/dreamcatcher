// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

library Address {
    function isContract(address account) internal view returns (bool) {
        return codeSize(account) > 0;
    }

    function codeSize(address account) internal view returns (uint256) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size;
    }
}