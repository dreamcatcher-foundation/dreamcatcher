// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IFacet} from "./IFacet.sol";
import {SolidStateDiamond} from "../../import/solidstate-v0.8.24/proxy/diamond/SolidStateDiamond.sol";

contract Diamond is SolidStateDiamond {
    constructor() SolidStateDiamond() {
        _setSupportsInterface(bytes4(keccak256("reconnect(address)")), true);
        _setSupportsInterface(bytes4(keccak256("connect(address)")), true);
        _setSupportsInterface(bytes4(keccak256("disconnect(address)")), true);
        _setSupportsInterface(bytes4(keccak256("disconnect()")), true);
        _setSupportsInterface(bytes4(keccak256("replaceSelectors(address,bytes4[])")), true);
        _setSupportsInterface(bytes4(keccak256("addSelectors(address,bytes4[])")), true);
        _setSupportsInterface(bytes4(keccak256("removeSelectors(bytes4[])")), true);
    }

    function reconnect(IFacet facetI) public virtual onlyOwner {
        replaceSelectors(address(facetI), facetI.selectors());
        return;
    }

    function connect(IFacet facetI) public virtual onlyOwner {
        addSelectors(address(facetI), facetI.selectors());
        return;
    }

    function disconnect(IFacet facetI) public virtual onlyOwner {
        removeSelectors(facetI.selectors());
        return;
    }

    function disconnect() public virtual onlyOwner {
        for (uint256 i = 0; i < _facetAddresses().length; i++) disconnect(IFacet(_facetAddresses()[i]));
        return;
    }

    function replaceSelectors(address implementation, bytes4[] memory selectors) public virtual onlyOwner {
        FacetCutAction action = FacetCutAction.REPLACE;
        FacetCut memory facetCut;
        facetCut.target = implementation;
        facetCut.action = action;
        facetCut.selectors = selectors;
        FacetCut[] memory facetCuts = new FacetCut[](1);
        facetCuts[0] = facetCut;
        address noAddress;
        bytes memory noBytes;
        _diamondCut(facetCuts, noAddress, noBytes);
        return;
    }

    function addSelectors(address implementation, bytes4[] memory selectors) public virtual onlyOwner {
        FacetCutAction action = FacetCutAction.ADD;
        FacetCut memory facetCut;
        facetCut.target = implementation;
        facetCut.action = action;
        facetCut.selectors = selectors;
        FacetCut[] memory facetCuts = new FacetCut[](1);
        facetCuts[0] = facetCut;
        address noAddress;
        bytes memory noBytes;
        _diamondCut(facetCuts, noAddress, noBytes);
        return;
    }

    function removeSelectors(bytes4[] memory selectors) public virtual onlyOwner {
        FacetCutAction action = FacetCutAction.REMOVE;
        FacetCut memory facetCut;
        bytes memory noBytes;
        facetCut.target = address(0);
        facetCut.action = action;
        facetCut.selectors = selectors;
        FacetCut[] memory facetCuts = new FacetCut[](1);
        facetCuts[0] = facetCut;
        _diamondCut(facetCuts, address(0), noBytes);
        return;
    }
}