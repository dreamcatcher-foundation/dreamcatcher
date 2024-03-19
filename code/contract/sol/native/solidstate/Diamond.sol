// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;
import "../../non-native/solidstate-v0.8.24/proxy/diamond/SolidStateDiamond.sol";
import "../../non-native/solidstate-v0.8.24/proxy/diamond/ISolidStateDiamond.sol";
import "../../non-native/solidstate-v0.8.24/proxy/diamond/readable/IDiamondReadable.sol";
import "../../non-native/solidstate-v0.8.24/proxy/diamond/writable/IDiamondWritable.sol";
import "../../non-native/solidstate-v0.8.24/proxy/diamond/writable/IDiamondWritableInternal.sol";
import "../interface/IFacet.sol";

contract Diamond is SolidStateDiamond {
    function addSelectors(address implementation, bytes4[] memory selectors) public virtual onlyOwner() returns (bool) {
        FacetCutAction action = FacetCutAction.ADD;
        FacetCut memory facetCut;
        facetCut.target = implementation;
        facetCut.action = action;
        facetCut.selectors = selectors;
        FacetCut[] memory facetCuts = new FacetCut[](1);
        facetCuts[0] = facetCut;
        bytes memory emptyBytes;
        _diamondCut(facetCuts, address(0), emptyBytes); // issue here
        return true;
    }

    function removeSelectors(address implementation, bytes4[] memory selectors) public virtual onlyOwner() returns (bool) {
        FacetCutAction action = FacetCutAction.REMOVE;
        FacetCut memory facetCut;
        facetCut.target = implementation;
        facetCut.action = action;
        facetCut.selectors = selectors;
        FacetCut[] memory facetCuts = new FacetCut[](1);
        facetCuts[0] = facetCut;
        bytes memory emptyBytes;
        _diamondCut(facetCuts, address(0), emptyBytes);
        return true;
    }

    function install(address facet) public virtual onlyOwner() returns (bool) {
        IFacet facetInterface = IFacet(facet);
        bytes4[] memory selectors = facetInterface.selectors();
        addSelectors(facet, selectors);
        return true;
    }

    function uninstall(address facet) public virtual onlyOwner() returns (bool) {
        IFacet facetInterface = IFacet(facet);
        bytes4[] memory selectors = facetInterface.selectors();
        removeSelectors(facet, selectors);
        return true;
    }
}