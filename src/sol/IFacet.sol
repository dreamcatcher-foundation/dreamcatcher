interface IFacet {
    function selectors() external pure returns (bytes4[] memory);
}