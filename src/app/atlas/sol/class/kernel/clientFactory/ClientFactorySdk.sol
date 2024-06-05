// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { ClientFactoryStorageSlot } from "./ClientFactoryStorageSlot.sol";
import { FacetRouterSocket } from "../facetRouter/FacetRouterSocket.sol";
import { IAuthFacet } from "../../../client/facet/auth/AuthFacet.sol";
import { ILauncher } from "../../../../launcher/ILauncher.sol";
import { IDiamond } from "../../Diamond.sol";

contract ClientFactorySdk is ClientFactoryStorageSlot, FacetRouterSocket {
    error DaoIdAlreadyInUse();
    error UnauthorizedOwner();

    function _deploy(string memory daoId) internal returns (address) {
        address client = ILauncher(_latestVersionOf("launcher.diamond")).launch();
        IDiamond diamond = IDiamond(client);
        diamond.install(_latestVersionOf("auth"));
        if (_clientFactoryStorageSlot().deployed[daoId] != address(0)) {
            revert DaoIdAlreadyInUse();
        }
        _clientFactoryStorageSlot().deployed[daoId] = address(diamond);
        _clientFactoryStorageSlot().owner[daoId] = msg.sender;
        return client;
    }

    function _installOn(string memory daoId, string memory facetId) internal returns (bool) {
        if (_clientFactoryStorageSlot().owner[daoId] != msg.sender) {
            revert UnauthorizedOwner();
        }
        IDiamond(payable(_clientFactoryStorageSlot().deployed[daoId])).install(_latestVersionOf(facetId));
        return true;
    }

    function _uninstallFrom(string memory daoId, string memory facetId) internal returns (bool) {
        if (_clientFactoryStorageSlot().owner[daoId] != msg.sender) {
            revert UnauthorizedOwner();
        }
        IDiamond(payable(_clientFactoryStorageSlot().deployed[daoId])).uninstall(_latestVersionOf(facetId));
        return true;
    }
}