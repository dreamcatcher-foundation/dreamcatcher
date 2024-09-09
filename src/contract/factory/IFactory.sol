// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {FactoryReceipt} from "./FactoryReceipt.sol";

interface IFactory {
    event ReceiptIssuance (
        uint256 timestamp, 
        address deployer, 
        address instance);
    function receipts() external view returns (FactoryReceipt[] memory);
    function receipts(uint256 i) external view returns (FactoryReceipt memory);
    function receipts(address deployer) external view returns (FactoryReceipt[] memory);
    function receipts(uint256 timestamp0, uint256 timestamp1) external view returns (FactoryReceipt[] memory);
}