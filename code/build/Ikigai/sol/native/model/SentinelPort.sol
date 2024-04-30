// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "../interface/IDiamond.sol";
import "../solidstate/Diamond.sol";
import "./SentinelSlot.sol";
import "./RouterPort.sol";

/**
* -> Basis implementation for the sentinel facet that enabled users to
*    manage their diamonds. Missing lots of key functionalities that
*    will be eventually added.
 */
contract SentinelPort is SentinelSlot, RouterPort {
    error CallerIsNotTheOwnerOfTheDiamond(string diamondId, address caller, address owner);
    error DiamondIdHasAlreadyBeenChosen(string diamondId);

    function _diamonds(string memory diamondId) internal view returns (address) {
        return _sentinel()._diamonds[diamondId];
    }

    function _diamondsOwner(string memory diamondId) internal view returns (address) {
        return _sentinel()._diamondsOwner[diamondId];
    }

    function _mintDiamond(string memory diamondId) internal returns (bool) {
        address diamond = _diamonds(diamondId);
        bool idHasAlreadyBeenChosen = diamond != address(0);
        if (idHasAlreadyBeenChosen) {
            revert DiamondIdHasAlreadyBeenChosen(diamondId);
        }
        address caller = msg.sender;
        diamond = address(new Diamond());
        _sentinel()._diamonds[diamondId] = diamond;
        _sentinel()._diamondsOwner[diamondId] = caller;
        IDiamond(diamond).install(_latestVersionOf("AuthFacet"));
        return true;
    }

    function _installFacetOn(string memory diamondId, string memory facetId, uint256 version) internal returns (bool) {
        return install_(diamondId, facetId, version);
    }

    function _installFacetOn(string memory diamondId, string memory facetId) internal returns (bool) {
        return install_(diamondId, facetId);
    }

    function _updateFacetOn(string memory diamondId, string memory facetId, uint256 version) internal returns (bool) {
        return update_(diamondId, facetId, version);
    }

    function _updateFacetOn(string memory diamondId, string memory facetId) internal returns (bool) {
        return update_(diamondId, facetId);
    }

    function install_(string memory diamondId, string memory facetId, uint256 version) private returns (bool) {
        address caller = msg.sender;
        address owner = _diamondsOwner(diamondId);
        bool callerIsNotTheOwner = caller != owner;
        if (callerIsNotTheOwner) {
            revert CallerIsNotTheOwnerOfTheDiamond(diamondId, caller, owner);
        }
        address diamond = _diamonds(diamondId);
        address facet = _versionOf(facetId, version);
        /**
        * -> The diamond will throw an error if the facet is already installed
        *    on the called diamond. Use install for new facets that have
        *    not already been installed. Notably, all facets should never have
        *    the same selectors as another facet, as it will become a mess.
        * 
        * -> Use the update function to update the version of a facet to a new
        *    version.
         */
        return IDiamond(diamond).install(facet);
    }

    function install_(string memory diamondId, string memory facetId) private returns (bool) {
        uint256 facetLatestVersion = _versionLengthOf(facetId) - 1;
        return install_(diamondId, facetId, facetLatestVersion);
    }

    function update_(string memory diamondId, string memory facetId, uint256 version) private returns (bool) {
        address caller = msg.sender;
        address owner = _diamondsOwner(diamondId);
        bool callerIsNotTheOwner = caller != owner;
        if (callerIsNotTheOwner) {
            revert CallerIsNotTheOwnerOfTheDiamond(diamondId, caller, owner);
        }
        address diamond = _diamonds(diamondId);
        address facet = _versionOf(facetId, version);
        return IDiamond(diamond).reinstall(facet);
    }

    function update_(string memory diamondId, string memory facetId) private returns (bool) {
        uint256 facetLatestVersion = _versionLengthOf(facetId) - 1;
        return update_(diamondId, facetId, facetLatestVersion);
    }
}