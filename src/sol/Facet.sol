import { IFacet } from "./IFacet.sol";

abstract contract Facet is IFacet {
    function selectors() external pure virtual returns (bytes4[] memory);
}