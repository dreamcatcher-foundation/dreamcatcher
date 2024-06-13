// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IFacet } from "../IFacet.sol";
import { ITokenFacet } from "./ITokenFacet.sol";
import { TokenSlLib } from "./TokenSlLib.sol"
import { TokenSlot } from "./TokenSlot.sol";
import { TokenSl } from "./TokenSl.sol";

contract TokenFacet is
    IFacet,
    ITokenFacet,
    TokenSlot {
    using TokenSlLib for TokenSl;

    function name() external view returns (string memory) {
        return _tokenSl().name();
    }

    
}