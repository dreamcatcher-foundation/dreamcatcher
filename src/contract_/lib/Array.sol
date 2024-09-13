// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;




library Array {





    function has(address[64] memory array, address item) internal pure returns (bool) {
        uint8 i;
        while (i < 64) {
            if (array[i] == item) return true;
            unchecked {
                i ++;
            }
        }
        return false;
    }
    
    function lookup(address[64] memory array, address item) internal pure returns (uint8) {
        uint8 i;
        while (i < 64) {
            if (array[i] == item) return i;
            unchecked {
                i ++;
            }
        }
        revert ("NOTHING_FOUND");
    }
    
    function nearestEmptyIndex(address[64] memory array) internal pure returns (uint8) {
        uint8 i;
        while (i < 64) {
            if (array[i] == address(0)) return i;
            unchecked {
                i ++;
            }
        }
        revert ("ARRAY_OUT_OF_SPACE");
    }

    function count(address[] memory array) internal pure returns (uint256) {
        uint256 count;
        uint256 i;
        while (i < array.length) {
            if (array[i] != address(0)) count += 1;
            unchecked {
                i += 1;
            }
        }
        return count;
    }

    function spaceLeft(address[64] memory array) internal pure returns (uint8) {
        uint8 count;
        uint8 i;
        while (i < 64) {
            address item = array[i];
            if (item == address(0)) count ++;
            unchecked {
                i ++;
            }
        }
        return count;
    }

    function isFull(bytes[] memory array) internal pure returns (bool) {
        uint256 i;
        while (i < array.length) {
            if (array[i].length == 0) return false;
            unchecked {
                i += 1;
            }
        }
        return true;
    }

    function isEmpty(bytes[] memory array) internal pure returns (bool) {
        uint256 i;
        while (i < array.length) {
            if (array[i].length != 0) return false;
            unchecked {
                i += 1;
            }
        }
        return true;
    }
}