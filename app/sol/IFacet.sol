// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

/**
* The `IFacet` interface provides a method for retrieving an array of function selectors.
* Facets represent external contracts containing the implementation logic for specific functionalities 
* within the diamond contract.
*
* Functions:
* - selectors(): Retrieves an array of function selectors.
*/
interface IFacet {
    /**
    * Retrieves an array of function selectors.
    * Function selectors uniquely identify functions within a contract.
    * Each function selector is a 4-byte identifier derived from the function's signature.
    * 
    * @return An array of function selectors.
    *
    * Example:
    * bytes4(keccak256("myFunction(string,address)"));
    * This encodes the function selector for a function named `myFunction` that takes 
    * a `string` and an `address` as parameters.
    */
    function selectors() external pure returns (bytes4[] memory);
}