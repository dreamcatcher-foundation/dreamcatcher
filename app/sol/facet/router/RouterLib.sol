// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Router } from "./Router.sol";
import { EnumerableSet } from "../../../import/openzeppelin/utils/structs/EnumerableSet.sol";

library RouterLib {
    using EnumerableSet for EnumerableSet.AddressSet;

    error NoCommitsFound();

    function versionOf(Router storage router, string memory key, uint256 version) internal view returns (address) {
        return router._versions[key].at(version);
    }

    function versionsOf(Router storage router, string memory key) internal view returns (address[] memory) {
        return router._versions[key].values();
    }

    function versionsLengthOf(Router storage router, string memory key) internal view returns (uint256) {
        return router._versions[key].length();
    }

    function latestVersionOf(Router storage router, string memory key) internal view returns (address) {
        if (versionsLengthOf(router, key) <= 0) {
            revert NoCommitsFound();
        }
        return router._versions[key][versionsLengthOf(router, key) - 1];
    }

    function commit(Router storage router, string memory key, address implementation) internal returns (bool) {
        return router._versions[key].add(implementation);
    }
}