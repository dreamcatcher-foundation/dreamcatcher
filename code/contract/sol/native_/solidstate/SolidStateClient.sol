// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import '../../non-native/solidstate-v0.8.24/proxy/diamond/SolidStateDiamond.sol';
import '../../non-native/solidstate-v0.8.24/proxy/diamond/ISolidStateDiamond.sol';
import '../../non-native/solidstate-v0.8.24/proxy/diamond/readable/IDiamondReadable.sol';
import '../../non-native/solidstate-v0.8.24/proxy/diamond/writable/IDiamondWritable.sol';
import '../../non-native/solidstate-v0.8.24/proxy/diamond/writable/IDiamondWritableInternal.sol';
import '../facets/Facet.sol';
import '../IGenerator.sol';

interface ISolidStateClient is ISolidStateDiamond {
    function install(address facet) external returns (bool);
    function uninstall(address facet) external returns (bool);
    function addSelectors(address implementation, bytes4[] memory selectors) external returns (bool);
    function removeSelectors(bytes4[] memory selectors) external returns (bool);
}

contract SolidStateClient is ISolidStateClient {
    function install(address facet) external virtual onlyOwner() returns (bool) {
        return install_(facet);
    }

    function uninstall(address facet) external virtual onlyOwner() returns (bool) {
        return uninstall_(facet);
    }

    function addSelectors(address implementation, bytes4[] memory selectors) external virtual onlyOwner() returns (bool) {
        return addSelectors_(implementation, selectors);
    }

    function removeSelectors(bytes4[] memory selectors) external virtual onlyOwner() returns (bool) {
        return removeSelectors_(selectors);
    }

    function install_(address facet) private returns (bool) {
        IFacet facetInterface = IFacet(facet);
        bytes4[] memory selectors = facetInterface.selectors();
        addSelectors_(facet, selectors);
        return true;
    }

    function uninstall_(address facet) private returns (bool) {
        IFacet facetInterface = IFacet(facet);
        bytes4[] memory selectors = facetInterface.selectors();
        removeSelectors_(selectors);
        return true;
    }

    function addSelectors_(address implementation, bytes4[] memory selectors) private returns (bool) {
        FacetCutAction action = FacetCutAction.ADD;
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

    function removeSelectors_(bytes4[] memory selectors) private returns (bool) {
        FacetCutAction action = FacetCutAction.REMOVE;
        FacetCut memory facetCut;
        facetCut.target = address(0);
        facetCut.action = action;
        facetCut.selectors = selectors;
        FacetCut[] memory facetCuts = new FacetCut[](1);
        facetCuts[0] = facetCut;
        bytes memory emptyBytes;
        _diamondCut(facetCuts, address(0), emptyBytes);
        return true;
    }
}

contract SolidStateClientGenerator is IGenerator {
    constructor() {}

    function generate() external virtual returns (address) {
        // ... TODO
    }
}