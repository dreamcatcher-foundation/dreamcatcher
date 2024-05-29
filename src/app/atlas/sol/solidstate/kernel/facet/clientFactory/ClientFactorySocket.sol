// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "./ClientFactoryStorageSlot.sol";
import "../facetRouter/FacetRouterSocket.sol";
import "../../../Diamond.sol";
import "../../../client/facet/auth/AuthFacet.sol";

contract ClientFactorySocket is ClientFactoryStorageSlot, FacetRouterSocket {
    error DaoIdAlreadyInUse();
    error UnauthorizedOwner();

    function _deploy(string memory daoId) internal returns (address) {
        Diamond diamond = new Diamond();
        diamond.install(_latestVersionOf("auth"));
        IAuthFacet(address(diamond)).claimOwnership();
        IAuthFacet(address(diamond)).transferRole(address(this), msg.sender, "owner");
        if (_clientFactoryStorageSlot().deployed[daoId] != address(0)) {
            revert DaoIdAlreadyInUse();
        }
        _clientFactoryStorageSlot().deployed[daoId] = address(diamond);
        _clientFactoryStorageSlot().owner[daoId] = msg.sender;
        return address(diamond);
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