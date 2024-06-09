// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { ISolidStateDiamond } from "./import/solidstate-v0.8.24/proxy/diamond/ISolidStateDiamond.sol";

/**
* The `IBase` interface defines essential functions for managing facets within the diamond standard 
* (EIP-2535) architecture, in addition to functionalities inherited from the `ISolidStateDiamond` interface.
* It includes functions for accessing facet information, managing ownership, upgrading facets, and 
* manipulating function selectors.
*
* Functions:
* - facetAddress(bytes4): Retrieves the address of the facet associated with the given function selector.
* - facetAddresses(): Retrieves an array of all facet addresses currently registered in the diamond contract.
* - facetFunctionSelectors(address): Retrieves an array of function selectors associated with the specified facet.
* - facets(address): Retrieves the selector and implementation addresses for all selectors in a specific facet.
* - getFallbackAddress(): Retrieves the fallback address configured for the diamond contract.
* - nomineeOwner(): Retrieves the nominee address set to become the new owner of the diamond contract.
* - owner(): Retrieves the current owner address of the diamond contract.
* - supportsInterface(bytes4): Checks if the diamond contract supports the specified interface Id.
* - acceptOwnership(): Accepts ownership transfer of the diamond contract to the nominee address.
* - diamondCut(): Updates the diamond contract's facets according to the provided data.
* - reinstall(address): Updates existing function selectors with their latest implementations from the specified facet address.
* - install(address): Adds a new facet to the diamond contract, enabling its functionalities.
* - pullSelectors(bytes4[]): Removes specified function selectors from the diamond contract.
* - pushSelectors(address, bytes4[]): Adds specified function selectors from a given facet to the diamond contract.
* - reinstall(address): Replaces current selectors with new implementations on the given facet.
* - replaceSelectors(address, bytes4[]): Serves as a lower-level alternative to the `reinstall` function.
* - setFallbackAddress(address): Sets the fallback address for the diamond contract.
* - transferOwnership(address): Initiates ownership transfer of the diamond contract to the specified address.
* - uninstall(address): Removes an existing facet from the diamond contract.
*
* Edge Cases:
* - All provided addresses must be valid and point to existing contracts. Invalid or non-existent 
*   addresses will result in reversion to maintain data integrity.
* - Reverting scenarios include attempts to access non-existent facets or selectors, executing 
*   unsupported interface checks, and invalid ownership transfer requests.
*/
interface IBase is ISolidStateDiamond {

    /**
    * The `install` function adds a new facet to the diamond contract, enabling its functionalities.
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
    function install(address facet) external returns (bool);

    /**
    * The `uninstall` function removes an existing facet from the diamond contract.
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
    function uninstall(address facet) external returns (bool);
    
    /**
    * Reinstalling selectors within the ERC2535 implementation entails updating existing 
    * function selectors with their latest implementations from the specified `facet` address.
    *
    * Edge Cases:
    * - If the specified `facet` address is invalid or points to a non-existent contract, 
    *   the function will revert, ensuring data integrity and preventing erroneous updates.
    * - In scenarios where no selectors have been previously installed within the ERC2535 
    *   implementation, attempting to execute the `reinstall` function will result in a 
    *   revert to prevent unintended modifications to the contract state.
    * - If the provided `facet` address does not contain valid implementations for all 
    *   existing selectors, the function will revert, maintaining the consistency of the 
    *   contract state and preventing incomplete updates.
    */
    function reinstall(address facet) external returns (bool);

    /**
    * The `pushSelectors` function adds the specified function selectors from a given `facet` 
    * to the diamond contract, enabling their associated functionalities.
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
    function pushSelectors(address facet, bytes4[] memory selectors) external returns (bool);

    /**
    * The `pullSelectors` function removes the specified function selectors from the 
    * diamond contract, effectively disabling their associated functionalities.
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
    function pullSelectors(bytes4[] memory selectors) external returns (bool);

    /**
    * The `replaceSelectors` function serves as a lower-level alternative to the `reinstall` function.
    *
    * Edge Cases:
    * - If the specified `facet` address is invalid or points to a non-existent contract, 
    *   the function will revert to maintain data integrity and prevent unintended updates.
    * - In situations where the provided `facet` address does not contain valid implementations 
    *   for all existing selectors, executing the `replaceSelectors` function will revert to 
    *   prevent incomplete updates and ensure the consistency of the contract state.
    */
    function replaceSelectors(address facet, bytes4[] memory selectors) external returns (bool);
}