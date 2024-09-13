// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IToken} from "../asset/token/IToken.sol";

struct UV2Path {
    IToken[] inner;
}

library UV2PathImpl {
    using UV2PathImpl for UV2Path;

    function tokenIn(UV2Path memory path) internal pure returns (IToken) {
        return path.inner[0];
    }

    function tokenOut(UV2Path memory path) internal pure returns (IToken) {
        return path.inner[path.inner.length - 1];
    }

    function toRaw(UV2Path memory path) internal pure returns (address[] memory) {
        address[] memory rawPath = new address[](path.inner.length);
        for (uint256 i = 0; i < path.inner.length; i++) rawPath[i] = address(path.inner[i]);
        return rawPath;
    }
}

struct Asset {
    IToken token;
    IToken currency;
    UV2Path[] tokenCurrencyPath;
    UV2Path[] currencyTokenPath;
    uint256 allocation;
}

library AssetImpl {
    
}

