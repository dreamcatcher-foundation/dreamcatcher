// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library DatabaseComponent {

    struct Database {
        bytes value;
    }

    function setBytes(Database storage database) {
        database.value;
    }

    function getBytes() {

    }

    function tryGetBytes() {

    }

    function trySetBytes() {
        
    }
}