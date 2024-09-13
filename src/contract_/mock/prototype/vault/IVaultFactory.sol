// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IVToken} from "../../../interface/asset/token/IVToken.sol";
import {Asset} from "./Asset.sol";

interface IVaultFactory {
    function deployed() external view returns (address[] memory);
    function deploy(IVToken vToken, Asset[] memory assets) external returns (address);
}