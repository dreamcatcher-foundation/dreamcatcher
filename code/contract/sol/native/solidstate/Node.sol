// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "../../non-native/solidstate-v0.8.24/proxy/diamond/SolidStateDiamond.sol";
import "../../non-native/solidstate-v0.8.24/proxy/diamond/ISolidStateDiamond.sol";
import "../../non-native/solidstate-v0.8.24/proxy/diamond/readable/IDiamondReadable.sol";
import "../../non-native/solidstate-v0.8.24/proxy/diamond/writable/IDiamondWritable.sol";
import "../../non-native/solidstate-v0.8.24/proxy/diamond/writable/IDiamondWritableInternal.sol";
import "../facets/IFacet.sol";

/**
* -> facetAddress
*    facetAddresses
*    facetFunctionSelectors
*    facets
*    getFallbackAddress
*    nomineeOwner
*    owner
*    supportsInterface
*
* -> acceptOwnership
*    diamondCut
*    install
*    pullSelectors
*    pushSelectors
*    reinstall
*    replaceSelectors
*    setFallbackAddress
*    transferOwnership
*    uninstall
 */
interface INode is ISolidStateDiamond {
    function install(address facet) external returns (bool);
    function reinstall(address facet) external returns (bool);
    function uninstall(address facet) external returns (bool);
    function replaceSelectors(address facet, bytes4[] memory selectors) external returns (bool);
    function pushSelectors(address facet, bytes4[] memory selectors) external returns (bool);
    function pullSelectors(bytes4[] memory selectors) external returns (bool);
}

contract Node is SolidStateDiamond {
    function install(address facet) external virtual onlyOwner() returns (bool) {
        return install_(facet);
    }

    function reinstall(address facet) external virtual onlyOwner() returns (bool) {
        return reinstall_(facet);
    }

    function uninstall(address facet) external virtual onlyOwner() returns (bool) {
        return uninstall_(facet);
    }

    function replaceSelectors(address facet, bytes4[] memory selectors) external virtual onlyOwner() returns (bool) {
        return replaceSelectors_(facet, selectors);
    }

    function pushSelectors(address facet, bytes4[] memory selectors) external virtual onlyOwner() returns (bool) {
        return pushSelectors_(facet, selectors);
    }

    function pullSelectors(bytes4[] memory selectors) external virtual onlyOwner() returns (bool) {
        return pullSelectors_(selectors);
    }

    function install_(address facet) private returns (bool) {
        IFacet facetInterface = IFacet(facet);
        bytes4[] memory selectors = facetInterface.selectors();
        return pushSelectors_(facet, selectors);
    }

    function reinstall_(address facet) private returns (bool) {
        IFacet facetInterface = IFacet(facet);
        bytes4[] memory selectors = facetInterface.selectors();
        return replaceSelectors_(facet, selectors);
    }

    function uninstall_(address facet) private returns (bool) {
        IFacet facetInterface = IFacet(facet);
        bytes4[] memory selectors = facetInterface.selectors();
        return pullSelectors_(selectors);
    }

    function replaceSelectors_(address facet, bytes4[] memory selectors) private returns (bool) {
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

    function pushSelectors_(address facet, bytes4[] memory selectors) private returns (bool) {
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

    function pullSelectors_(bytes4[] memory selectors) private returns (bool) {
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