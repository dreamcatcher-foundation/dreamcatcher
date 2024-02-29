// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library UserbaseComponent {
    event NewUser(address account);

    struct Userbase {
        string username;
    }

    

    function users(uint256 i) {

    }

    function username(Userbase storage userbase) internal view returns (uint) {

        emit NewUser();
        return userbase.username;
    }
}