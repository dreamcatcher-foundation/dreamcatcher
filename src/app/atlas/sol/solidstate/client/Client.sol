// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "../../interface/IFacet.sol";
import "../../import/solidstate-v0.8.24/proxy/diamond/SolidStateDiamond.sol";

contract Client is SolidStateDiamond {
    function reinstall(address facet) external virtual onlyOwner() returns (bool) {
        return _reinstall(facet);
    }

    function install(address facet) external virtual onlyOwner() returns (bool) {
        return _install(facet);
    }

    function uninstall(address facet) external virtual onlyOwner() returns (bool) {
        return _uninstall(facet);
    }

    function replaceSelectors(address facet, bytes4[] memory selectors) external virtual onlyOwner() returns (bool) {
        return _replaceSelectors(facet, selectors);
    }

    function pushSelectors(address facet, bytes4[] memory selectors) external virtual onlyOwner() returns (bool) {
        return _pushSelectors(facet, selectors);
    }

    function pullSelectors(bytes4[] memory selectors) external virtual onlyOwner() returns (bool) {
        return _pullSelectors(selectors);
    }

    function _reinstall(address facet) private returns (bool) {
        IFacet facetInterface = IFacet(facet);
        bytes4[] memory selectors = facetInterface.selectors();
        return _replaceSelectors(facet, selectors);
    }

    function _install(address facet) private returns (bool) {
        IFacet facetInterface = IFacet(facet);
        bytes4[] memory selectors = facetInterface.selectors();
        return _pushSelectors(facet, selectors);
    }

    function _uninstall(address facet) private returns (bool) {
        IFacet facetInterface = IFacet(facet);
        bytes4[] memory selectors = facetInterface.selectors();
        return _pullSelectors(selectors);
    }

    function _replaceSelectors(address facet, bytes4[] memory selectors) private returns (bool) {
        FacetCutAction action = FacetCutAction.REPLACE;
        FacetCut memory facetCut;
        facetCut.target = facet;
        facetCut.action = action;
        facetCut.selectors = selectors;
        FacetCut[] memory facetCuts = new FacetCut[](1);
        facetCuts[0] = facetCut;
        address noAddress;
        bytes memory noBytes;
        _diamondCut(facetCuts, noAddress, noBytes);
        return true;
    }

    function _pushSelectors(address facet, bytes4[] memory selectors) private returns (bool) {
        FacetCutAction action = FacetCutAction.ADD;
        FacetCut memory facetCut;
        facetCut.target = facet;
        facetCut.action = action;
        facetCut.selectors = selectors;
        FacetCut[] memory facetCuts = new FacetCut[](1);
        facetCuts[0] = facetCut;
        address noAddress;
        bytes memory noBytes;
        _diamondCut(facetCuts, noAddress, noBytes);
        return true;
    }

    function _pullSelectors(bytes4[] memory selectors) private returns (bool) {
        FacetCutAction action = FacetCutAction.REMOVE;
        FacetCut memory facetCut;
        address noAddress;
        bytes memory noBytes;
        facetCut.target = noAddress;
        facetCut.action = action;
        facetCut.selectors = selectors;
        FacetCut[] memory facetCuts = new FacetCut[](1);
        facetCuts[0] = facetCut;
        _diamondCut(facetCuts, noAddress, noBytes);
        return true;
    }
}