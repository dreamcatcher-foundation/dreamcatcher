// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IToken} from "../IToken.sol";

interface IOwnableToken is IToken {
    function owner() external view returns (address);
    function renounceOwnership() external;
    function transferOwnership(address account) external;
    function mint(address account, uint256 amount) external;
    function burn(address account, uint256 amount) external;
}