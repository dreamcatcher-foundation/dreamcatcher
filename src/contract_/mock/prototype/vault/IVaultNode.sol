// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IVToken} from "../../../interface/asset/token/IVToken.sol";
import {IOwnableToken} from "../../../asset/token/ownable-token/IOwnableToken.sol";
import {IVaultFactory} from "./IVaultFactory.sol";
import {IOwnableTokenFactory} from "../../../asset/token/ownable-token/IOwnableTokenFactory.sol";
import {Asset} from "./Asset.sol";

interface IVaultNode {
    event Deploy(address deployer, address instance);
    function size() external view returns (uint256);
    function child(uint256 i) external view returns (address[] memory);
    function vaultFactory() external view returns (address);
    function ownableTokenFactory() external view returns (address);
    function mint(string memory name, string memory symbol, Asset[] memory assets) external returns (address);
}