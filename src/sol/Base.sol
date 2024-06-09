// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IBase } from "./IBase.sol";
import { IFacet } from "./IFacet.sol";
import { SolidStateDiamond } from "./import/solidstate-v0.8.24/proxy/diamond/SolidStateDiamond.sol";

/**
* The `Base` contract inherits from the `IBase` interface and extends the `SolidStateDiamond` contract, 
* implementing functions for managing facets within the diamond standard architecture.
*
* Functions:
* - install(address facet): Adds a new facet to the diamond contract, enabling its functionalities.
* - uninstall(address facet): Removes an existing facet from the diamond contract.
* - reinstall(address facet): Updates existing function selectors with their latest implementations from the specified facet address.
* - pushSelectors(address facet, bytes4[] memory selectors): Adds specified function selectors from a given facet to the diamond contract.
* - pullSelectors(bytes4[] memory selectors): Removes specified function selectors from the diamond contract.
* - replaceSelectors(address facet, bytes4[] memory selectors): Serves as a lower-level alternative to the `reinstall` function.
*
* Modifiers:
* - onlyOwner(): Restricts access to functions to the owner of the contract.
*
* Edge Cases:
* - All provided addresses must be valid and point to existing contracts. Invalid or non-existent 
*   addresses will result in reversion to maintain data integrity.
* - Reverting scenarios include attempts to access non-existent facets or selectors.
*/
contract Base is IBase, SolidStateDiamond {

    /**
    * Adds a new facet to the diamond contract, enabling its functionalities.
    * 
    * @param facet The address of the facet to be installed in the diamond contract.
    * 
    * @return A boolean indicating the success of the operation. Returns true if the addition 
    *         of the facet is successful, otherwise reverts.
    * 
    * Modifiers:
    * - onlyOwner(): Restricts access to the owner of the contract.
    * 
    * Edge Cases:
    * - If the provided `facet` address is invalid or points to a non-existent contract, 
    *   the function will revert to maintain data integrity and prevent unintended updates.
    * - In scenarios where the specified facet address corresponds to an already installed 
    *   facet within the diamond contract, the function will revert to prevent duplicate 
    *   installations and ensure the consistency of the contract state.
    */
    function install(address facet) external virtual onlyOwner() returns (bool) {
        return _install(facet);
    }

    /**
    * Removes an existing facet from the diamond contract.
    * 
    * @param facet The address of the facet to be uninstalled from the diamond contract.
    * 
    * @return A boolean indicating the success of the operation. Returns true if the removal 
    *         of the facet is successful, otherwise reverts.
    * 
    * Modifiers:
    * - onlyOwner(): Restricts access to the owner of the contract.
    * 
    * Edge Cases:
    * - If the provided `facet` address is invalid or points to a non-existent contract, 
    *   the function will revert to maintain data integrity and prevent unintended updates.
    * - In scenarios where the specified facet address does not correspond to an installed 
    *   facet within the diamond contract, the function will revert to prevent invalid removal 
    *   attempts and ensure the consistency of the contract state.
    */
    function uninstall(address facet) external virtual onlyOwner() returns (bool) {
        return _uninstall(facet);
    }

    /**
    * Updates existing function selectors with their latest implementations from the specified facet address.
    * 
    * @param facet The address of the facet containing the new implementations.
    * 
    * @return A boolean indicating the success of the operation. Returns true if the reinstallation 
    *         is successful, otherwise reverts.
    * 
    * Modifiers:
    * - onlyOwner(): Restricts access to the owner of the contract.
    * 
    * Edge Cases:
    * - If the provided `facet` address is invalid or points to a non-existent contract, 
    *   the function will revert, ensuring data integrity and preventing erroneous updates.
    * - In scenarios where no selectors have been previously installed within the ERC2535 
    *   implementation, attempting to execute the `_reinstall` function will result in a 
    *   revert to prevent unintended modifications to the contract state.
    * - If the provided `facet` address does not contain valid implementations for all 
    *   existing selectors, the function will revert, maintaining the consistency of the 
    *   contract state and preventing incomplete updates.
    */
    function reinstall(address facet) external virtual onlyOwner() returns (bool) {
        return _reinstall(facet);
    }

    /**
    * Adds specified function selectors from a given facet to the diamond contract.
    * 
    * @param facet The address of the facet containing the function selectors to be added.
    * @param selectors An array of function selectors to be added to the diamond contract.
    * 
    * @return A boolean indicating the success of the operation. Returns true if the addition 
    *         of selectors is successful, otherwise reverts.
    * 
    * Modifiers:
    * - onlyOwner(): Restricts access to the owner of the contract.
    * 
    * Edge Cases:
    * - If the provided `facet` address is invalid or points to a non-existent contract, 
    *   the function will revert to maintain data integrity and prevent unintended updates.
    * - In scenarios where the specified function selectors already exist within the diamond 
    *   contract, the function will revert to prevent duplicate additions and ensure the 
    *   consistency of the contract state.
    * - If the provided array of function selectors is empty, the function will revert as 
    *   there are no selectors to push, ensuring no unintended changes to the contract state.
    */
    function pushSelectors(address facet, bytes4[] memory selectors) external virtual onlyOwner() returns (bool) {
        return _pushSelectors(facet, selectors);
    }

    /**
    * Removes specified function selectors from the diamond contract.
    * 
    * @param selectors An array of function selectors to be removed from the diamond contract.
    * 
    * @return A boolean indicating the success of the operation. Returns true if the removal 
    *         of selectors is successful, otherwise reverts.
    * 
    * Modifiers:
    * - onlyOwner(): Restricts access to the owner of the contract.
    * 
    * Edge Cases:
    * - If the provided array of function selectors is empty, the function will revert as 
    *   there are no selectors to pull, ensuring no unintended changes to the contract state.
    * - In scenarios where the specified function selectors do not exist within the diamond 
    *   contract, the function will revert to maintain the integrity of the contract state 
    *   and prevent invalid removal attempts.
    */
    function pullSelectors(bytes4[] memory selectors) external virtual onlyOwner() returns (bool) {
        return _pullSelectors(selectors);
    }

    /**
    * Serves as a lower-level alternative to the `reinstall` function.
    * 
    * @param facet The address of the facet containing the new implementations.
    * @param selectors An array of function selectors to be replaced.
    * 
    * @return A boolean indicating the success of the operation. Returns true if the replacement 
    *         is successful, otherwise reverts.
    * 
    * Modifiers:
    * - onlyOwner(): Restricts access to the owner of the contract.
    * 
    * Edge Cases:
    * - If the specified `facet` address is invalid or points to a non-existent contract, 
    *   the function will revert to maintain data integrity and prevent unintended updates.
    * - In situations where the provided `facet` address does not contain valid implementations 
    *   for all existing selectors, executing the `_replaceSelectors` function will revert to 
    *   prevent incomplete updates and ensure the consistency of the contract state.
    */
    function replaceSelectors(address facet, bytes4[] memory selectors) external virtual onlyOwner() returns (bool) {
        return _replaceSelectors(facet, selectors);
    }

    /**
    * Adds a new facet to the diamond contract, enabling its functionalities.
    * 
    * @param facet The address of the facet to be installed in the diamond contract.
    * 
    * @return A boolean indicating the success of the operation. Returns true if the addition 
    *         of the facet is successful, otherwise reverts.
    * 
    * Edge Cases:
    * - If the provided `facet` address is invalid or points to a non-existent contract, 
    *   the function will revert to maintain data integrity and prevent unintended updates.
    * - In scenarios where the specified facet address corresponds to an already installed 
    *   facet within the diamond contract, the function will revert to prevent duplicate 
    *   installations and ensure the consistency of the contract state.
    */
    function _install(address facet) private returns (bool) {
        IFacet facetInterface = IFacet(facet);
        bytes4[] memory selectors = facetInterface.selectors();
        return _pushSelectors(facet, selectors);
    }

    /**
    * Removes an existing facet from the diamond contract.
    * 
    * @param facet The address of the facet to be uninstalled from the diamond contract.
    * 
    * @return A boolean indicating the success of the operation. Returns true if the removal 
    *         of the facet is successful, otherwise reverts.
    * 
    * Edge Cases:
    * - If the provided `facet` address is invalid or points to a non-existent contract, 
    *   the function will revert to maintain data integrity and prevent unintended updates.
    * - In scenarios where the specified facet address does not correspond to an installed 
    *   facet within the diamond contract, the function will revert to prevent invalid removal 
    *   attempts and ensure the consistency of the contract state.
    */
    function _uninstall(address facet) private returns (bool) {
        IFacet facetInterface = IFacet(facet);
        bytes4[] memory selectors = facetInterface.selectors();
        return _pullSelectors(selectors);
    }

    /**
    * Updates existing function selectors with their latest implementations from the specified facet address.
    * 
    * @param facet The address of the facet containing the new implementations.
    * 
    * @return A boolean indicating the success of the operation. Returns true if the reinstallation 
    *         is successful, otherwise reverts.
    * 
    * Edge Cases:
    * - If the provided `facet` address is invalid or points to a non-existent contract, 
    *   the function will revert, ensuring data integrity and preventing erroneous updates.
    * - In scenarios where no selectors have been previously installed within the ERC2535 
    *   implementation, attempting to execute the `_reinstall` function will result in a 
    *   revert to prevent unintended modifications to the contract state.
    * - If the provided `facet` address does not contain valid implementations for all 
    *   existing selectors, the function will revert, maintaining the consistency of the 
    *   contract state and preventing incomplete updates.
    */
    function _reinstall(address facet) private returns (bool) {
        IFacet facetInterface = IFacet(facet);
        bytes4[] memory selectors = facetInterface.selectors();
        return _replaceSelectors(facet, selectors);
    }

    /**
    * Adds specified function selectors from a given facet to the diamond contract.
    * 
    * @param facet The address of the facet containing the function selectors to be added.
    * @param selectors An array of function selectors to be added to the diamond contract.
    * 
    * @return A boolean indicating the success of the operation. Returns true if the addition 
    *         of selectors is successful, otherwise reverts.
    * 
    * Edge Cases:
    * - If the provided `facet` address is invalid or points to a non-existent contract, 
    *   the function will revert to maintain data integrity and prevent unintended updates.
    * - In scenarios where the specified function selectors already exist within the diamond 
    *   contract, the function will revert to prevent duplicate additions and ensure the 
    *   consistency of the contract state.
    * - If the provided array of function selectors is empty, the function will revert as 
    *   there are no selectors to push, ensuring no unintended changes to the contract state.
    */
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

    /**
    * Removes specified function selectors from the diamond contract.
    * 
    * @param selectors An array of function selectors to be removed from the diamond contract.
    * 
    * @return A boolean indicating the success of the operation. Returns true if the removal 
    *         of selectors is successful, otherwise reverts.
    * 
    * Edge Cases:
    * - If the provided array of function selectors is empty, the function will revert as 
    *   there are no selectors to pull, ensuring no unintended changes to the contract state.
    * - In scenarios where the specified function selectors do not exist within the diamond 
    *   contract, the function will revert to maintain the integrity of the contract state 
    *   and prevent invalid removal attempts.
    */
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

    /**
    * Serves as a lower-level alternative to the `reinstall` function.
    * 
    * @param facet The address of the facet containing the new implementations.
    * @param selectors An array of function selectors to be replaced.
    * 
    * @return A boolean indicating the success of the operation. Returns true if the replacement 
    *         is successful, otherwise reverts.
    * 
    * Edge Cases:
    * - If the specified `facet` address is invalid or points to a non-existent contract, 
    *   the function will revert to maintain data integrity and prevent unintended updates.
    * - In situations where the provided `facet` address does not contain valid implementations 
    *   for all existing selectors, executing the `_replaceSelectors` function will revert to 
    *   prevent incomplete updates and ensure the consistency of the contract state.
    */
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
}