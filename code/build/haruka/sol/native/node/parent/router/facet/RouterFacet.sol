// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "../slot/RouterSlot.sol";
import "../../auth/socket/AuthSocket.sol";

contract RouterFacet is RouterSlot, AuthSocket {
    error ComponentUnavailable();

    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](3);
        selectors[0] = bytes4(keccak256("versionsOf(bytes32)"));
        selectors[1] = bytes4(keccak256("latestVersionOf(bytes32)"));
        selectors[2] = bytes4(keccak256("commit(bytes32,address)"));
        return selectors;
    }

    function versionsOf(bytes32 componentId) external view returns (address[] memory) {
        return _versionsOf()[componentId];
    }

    function latestVersionOf(bytes32 componentId) external view returns (address) {
        uint256 versionsCount = _versionsOf()[componentId].length;
        bool hasAtLeastOneVersion = versionsCount != 0;
        if (!hasAtLeastOneVersion) {
            revert ComponentUnavailable();
        }
        uint256 versionsLastIndex = versionsCount - 1;
        address latestVersion = versionsOf(componentId)[versionsLastIndex];
        return latestVersion;
    }

    function commit(bytes32 componentId, address component) external returns (bool) {
        bytes32 rootAdminRole = keccak256("*");
        _onlyRole(rootAdminRole);
        _versionsOf()[componentId].push(component);
        return true;
    }
}