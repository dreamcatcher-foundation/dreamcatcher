// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IPlugIn } from "./IPlugIn.sol";
import { SolidStateDiamond } from "./import/solidstate-v0.8.24/proxy/diamond/SolidStateDiamond.sol";

contract Node is SolidStateDiamond {
    function reinstall(address plugIn) external virtual onlyOwner() returns (bool) {
        return _reinstall(plugIn);
    }

    function install(address plugIn) external virtual onlyOwner() returns (bool) {
        return _install(plugIn);
    }

    function uninstall(address plugIn) external virtual onlyOwner() returns (bool) {
        return _uninstall(plugIn);
    }

    function replaceSelectors(address plugIn, bytes4[] memory selectors) external virtual onlyOwner() returns (bool) {
        return _replaceSelectors(plugIn, selectors);
    }

    function pushSelectors(address plugIn, bytes4[] memory selectors) external virtual onlyOwner() returns (bool) {
        return _pushSelectors(plugIn, selectors);
    }

    function pullSelectors(bytes4[] memory selectors) external virtual onlyOwner() returns (bool) {
        return _pullSelectors(selectors);
    }

    function _reinstall(address plugIn) private returns (bool) {
        IPlugIn plugInInterface = IFacet(plugIn);
        bytes4[] memory selectors = plugInInterface.selectors();
        return _replaceSelectors(plugIn, selectors);
    }

    function _install(address plugIn) private returns (bool) {
        IPlugIn plugInInterface = IFacet(plugIn);
        bytes4[] memory selectors = plugInInterface.selectors();
        return _pushSelectors(plugIn, selectors);
    }

    function _uninstall(address plugIn) private returns (bool) {
        IPlugIn plugInInterface = IFacet(plugIn);
        bytes4[] memory selectors = plugInInterface.selectors();
        return _pullSelectors(selectors);
    }

    function _replaceSelectors(address plugIn, bytes4[] memory selectors) private returns (bool) {
        FacetCutAction action = FacetCutAction.REPLACE;
        FacetCut memory facetCut;
        facetCut.target = plugIn;
        facetCut.action = action;
        facetCut.selectors = selectors;
        FacetCut[] memory facetCuts = new FacetCut[](1);
        facetCuts[0] = facetCut;
        address noAddress;
        bytes memory noBytes;
        _diamondCut(facetCuts, noAddress, noBytes);
        return true;
    }

    function _pushSelectors(address plugIn, bytes4[] memory selectors) private returns (bool) {
        FacetCutAction action = FacetCutAction.ADD;
        FacetCut memory facetCut;
        facetCut.target = plugIn;
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