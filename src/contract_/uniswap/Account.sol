// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;



library Account {
    error ZeroAddress();

    function onlyNonZeroAddress(address account) internal pure {
        if (account == address(0)) revert ZeroAddress();
        return;
    }
}