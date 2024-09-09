// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IFactory} from "./IFactory.sol";
import {FactoryReceipt} from "./FactoryReceipt.sol";

abstract contract Factory is IFactory {
    FactoryReceipt[] private _receipts;

    function receipts() public view virtual returns (FactoryReceipt[] memory) {
        FactoryReceipt[] memory receipts = new FactoryReceipt[](_receipts.length);
        for (uint256 i = 0; i < _receipts.length; i++) receipts[i] = _receipts[i];
        return receipts;
    }

    function receipts(uint256 i) public view virtual returns (FactoryReceipt memory) {
        require(i < _receipts.length, "out-of-bounds");
        return receipts()[i];
    }

    function receipts(address deployer) public view virtual returns (FactoryReceipt[] memory) {
        uint256 length = _receipts.length;
        uint256 count = 0;
        for (uint256 i = 0; i < length; i++) if (_receipts[i].deployer == deployer) count++;
        FactoryReceipt[] memory receipts = new FactoryReceipt[](count);
        uint256 cursor = 0;
        for (uint256 i = 0; i < length; i++) if (_receipts[i].deployer == deployer) {
            receipts[cursor] = _receipts[i];
            cursor++;
        }
        return receipts;
    }

    function receipts(uint256 timestamp0, uint256 timestamp1) public view virtual returns (FactoryReceipt[] memory) {
        require(timestamp0 <= timestamp1, "illegal-timestamp-range");
        uint256 length = _receipts.length;
        uint256 count = 0;
        for (uint256 i = 0; i < length; i++) if (_receipts[i].timestamp >= timestamp0 && _receipts[i].timestamp <= timestamp1) count++;
        FactoryReceipt[] memory receipts = new FactoryReceipt[](count);
        uint256 cursor = 0;
        for (uint256 i = 0; i < length; i++) if (_receipts[i].timestamp >= timestamp0 && _receipts[i].timestamp <= timestamp1) {
            receipts[cursor] = _receipts[i];
            cursor++;
        }
        return receipts;
    }

    function _issueReceipt(address instance) internal virtual {
        return _issueReceipt(FactoryReceipt({
            timestamp: block.timestamp,
            deployer: msg.sender,
            instance: instance
        }));
    }

    function _issueReceipt(FactoryReceipt memory receipt) internal virtual {
        _receipts.push(receipt);
        emit ReceiptIssuance(
            receipt.timestamp,
            receipt.deployer,
            receipt.instance);
        return;
    }
}