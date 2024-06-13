// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Safe } from "./Safe.sol";
import { IERC20 } from "../../import/";

library SafeLib {
    function isSupported(Safe storage safe, address token) internal view returns (bool) {
        return safe.inner.supportedTokens.contains(token);
    }

    function assets()
}