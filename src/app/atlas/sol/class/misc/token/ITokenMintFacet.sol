// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IFacet } from "../../../IFacet.sol";

interface ITokenMintFacet {
    function mint(address account, uint256 amount) external returns (bool);
}