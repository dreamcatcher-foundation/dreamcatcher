// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IFacet } from "../IFacet.sol";
import { ITokenFacet } from "./ITokenFacet.sol";
import { TokenLib } from "./TokenLib.sol";
import { TokenSlot } from "./TokenSlot.sol";
import { Token } from "./Token.sol";

contract TokenFacet is IFacet, ITokenFacet, TokenSlot {
    using TokenLib for Token;

    function symbol() external view returns (string memory) {
        return _token().symbol();
    }

    
}