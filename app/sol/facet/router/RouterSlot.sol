// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { EnumerableSet } from "../../../import/openzeppelin/utils/structs/EnumerableSet.sol";

contract RouterSlot {
    bytes32 constant internal _ROUTER_SLOT = bytes32(uint256(keccak256("eip1976.router")) - 1);

    function _versions() internal pure returns (mapping(string => EnumerableSet.AddressSet) storage storageLayout) {
        bytes32 slot = _ROUTER_SLOT;
        assembly {
            storageLayout.slot := slot
        }
    }
}