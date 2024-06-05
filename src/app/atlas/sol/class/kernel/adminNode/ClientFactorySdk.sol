// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { ClientFactoryStorageSlot } from "./DiamondLauncherSlot.sol";
import { FacetRouterSocket } from "../router/RouterSdk.sol";
import { IAuthFacet } from "../../misc/auth/IAuthFacet.sol";
import { ILauncher } from "../../../../launcher/ILauncher.sol";
import { IDiamond } from "../../Diamond.sol";

contract ClientFactorySdk is DiamondLauncherSlot, RouterSdk {
    error DaoIdAlreadyInUse();
    error UnauthorizedOwner();

    function _deploy(string memory daoName) internal returns (address) {
        address client = ILauncher(_latestVersionOf("launcher.diamond")).launch();
        IDiamond diamond = IDiamond(client);
        diamond.install(_latestVersionOf("auth"));
        if (_clientFactoryStorageSlot().deployed[daoId] != address(0)) {
            revert DaoIdAlreadyInUse();
        }
        _diamondLauncher().deployed[daoId] = address(diamond);
        _diamondLauncher().owner[daoId] = msg.sender;
        return client;
    }

    function _installOn(string memory daoId, string memory facetId) internal returns (bool) {
        if (_diamondLauncher().owner[daoId] != msg.sender) {
            revert UnauthorizedOwner();
        }
        IDiamond(payable(_diamondLauncher().deployed[daoId])).install(_latestVersionOf(facetId));
        return true;
    }

    function _uninstallFrom(string memory daoId, string memory facetId) internal returns (bool) {
        if (_diamondLauncher().owner[daoId] != msg.sender) {
            revert UnauthorizedOwner();
        }
        IDiamond(payable(_diamondLauncher().deployed[daoId])).uninstall(_latestVersionOf(facetId));
        return true;
    }
}