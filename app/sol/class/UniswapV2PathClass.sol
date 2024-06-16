// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IERC20Metadata } from "../imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";

library UniswapV2PathClass {
    using UniswapV2PathClass for UniswapV2Path;

    error InvalidUniswapV2Path();

    struct UniswapV2Path {
        State state;
    }

    struct State {
        address[] path;
    }

    function unwrap(UniswapV2Path storage self) internal view returns (UniswapV2Path storage) {
        if (self.path.length < 2) {
            revert InvalidUniswapV2Path();
        }
        return self;
    }

    function firstTokenDecimals(UniswapV2Path storage self) internal view returns (uint8) {
        return IERC20Metadata(self.unwrap().firstToken()).decimals();
    }

    function lastTokenDecimals(UniswapV2Path storage self) internal view returns (uint8) {
        return IERC20Metadata(self.unwrap().lastToken()).decimals();
    }

    function firstToken(UniswapV2Path storage self) internal view returns (address) {
        return self.unwrap().path[0];
    }

    function lastToken(UniswapV2Path storage self) internal view returns (address) {
        return self.unwrap().state.path[self.state.path.length - 1];
    }
}