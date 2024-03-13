// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../../non-native/solidstate-v0.8.24/proxy/diamond/SolidStateDiamond.sol";
import "../../non-native/solidstate-v0.8.24/proxy/diamond/ISolidStateDiamond.sol";
import "../../non-native/solidstate-v0.8.24/proxy/diamond/readable/IDiamondReadable.sol";
import "../../non-native/solidstate-v0.8.24/proxy/diamond/writable/IDiamondWritable.sol";
import "../../non-native/solidstate-v0.8.24/proxy/diamond/writable/IDiamondWritableInternal.sol";
import "../interface/IFacet.sol";

/**
* NOTE Diamond is a layer of abstraction over the SolidStateDiamond
*      which picks selectors directly from IFacet contracts and
*      forms the foundation of modular plugIn-like architecture.
 */
contract Diamond is SolidStateDiamond {

    /**
     * @dev Adds selectors to the diamond contract.
     * @param implementation The address of the facet implementing the selectors.
     * @param selectors The array of function selectors to be added.
     * @return A boolean indicating whether the addition was successful or not.
     */
    function addSelectors(address implementation, bytes4[] memory selectors) public virtual onlyOwner() returns (bool) {
        FacetCutAction action = FacetCutAction.ADD;
        FacetCut memory facetCut = FacetCut(implementation, action, selectors);
        IDiamondWritable diamond = IDiamondWritable(address(this));
        FacetCut[] memory facetCuts;
        facetCuts = new FacetCut[](1);
        facetCuts[0] = facetCut;
        diamond.diamondCut(facetCuts, address(this), "");
        return true;
    }

    /**
     * @dev Removes selectors from the diamond contract.
     * @param implementation The address of the facet implementing the selectors.
     * @param selectors The array of function selectors to be removed.
     * @return A boolean indicating whether the removal was successful or not.
     */
    function removeSelectors(address implementation, bytes4[] memory selectors) public virtual onlyOwner() returns (bool) {
        FacetCutAction action = FacetCutAction.REMOVE;
        FacetCut memory facetCut = FacetCut(implementation, action, selectors);
        IDiamondWritable diamond = IDiamondWritable(address(this));
        FacetCut[] memory facetCuts;
        facetCuts = new FacetCut[](1);
        facetCuts[0] = facetCut;
        diamond.diamondCut(facetCuts, address(this), "");
        return true;
    }

    /**
     * @dev Installs a new facet into the diamond contract.
     * @param facet The address of the new facet to be installed.
     * @return A boolean indicating whether the installation was successful or not.
     */
    function install(address facet) public virtual onlyOwner() returns (bool) {
        IFacet facetInterface = IFacet(facet);
        bytes4[] memory selectors = facetInterface.selectors();
        addSelectors(facet, selectors);
        return true;
    }

    /**
     * @dev Uninstalls an existing facet from the diamond contract.
     * @param facet The address of the facet to be uninstalled.
     * @return A boolean indicating whether the uninstallation was successful or not.
     */
    function uninstall(address facet) public virtual onlyOwner() returns (bool) {
        IFacet facetInterface = IFacet(facet);
        bytes4[] memory selectors = facetInterface.selectors();
        removeSelectors(facet, selectors);
        return true;
    }
}