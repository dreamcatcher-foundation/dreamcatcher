// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Path } from "./Path.sol";

library PathLogic {
    using PathLogic for Path;

    function token0(Path storage path) internal pure returns (address) {
        return path._inner[0];
    }

    function token1(Path storage path) internal pure returns (address) {
        return path._inner[path]
    }

    function reverse(Path storage path) internal pure returns (Path memory) {
        address[] memory reversed = new address[](path._inner.length);
        for (uint256 i = 0; i < path._inner.length; i += 1) {
            reversed[i] = path._inner[path._inner.length - 1 - i];
        }
        return Path({ path: reversed });
    }
}