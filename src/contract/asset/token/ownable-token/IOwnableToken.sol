// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IErc20} from "../../../interface/standard/IErc20.sol";

interface IOwnableToken is IErc20 {
    function owner() external view returns (address);
    function renounceOwnership() external;
    function transferOwnership(address account) external;
    function mint(address account, uint256 amount) external;
    function burn(address account, uint256 amount) external;
}