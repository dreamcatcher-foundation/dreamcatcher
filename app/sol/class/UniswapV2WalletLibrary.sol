// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { UniswapV2PairLibrary } from "./UniswapV2PairLibrary.sol";
import { FixedPointMathLibrary } from "";

library UniswapV2WalletLibrary {
    error AlreadyBinded();


    struct UniswapV2Wallet {
        UniswapV2PairLibrary.UniswapV2Pair[] pairs;
        address asset;
        bool isBinded;
    }

    function netBestAssetValue(UniwapV2Wallet storage self) internal view returns (FixedPointMathLibrary.FixedPointValue memory R18) {
        R18 = FixedPointMathLibrary.FixedPointValue({ value: 0, decimals: 18 });
        for (uint256 i = 0; i < self.pairs.length; i++) {
            R18 = R18.add(self.pairs[i].bestAssetsValue());
        }
        return R18;
    }

    function netRealAssetValue(UniwapV2Wallet storage self) internal view returns (FixedPointMathLibrary.FixedPointValue memory R18) {
        R18 = FixedPointMathLibrary.FixedPointValue({ value: 0, decimals: 18 });
        for (uint256 i = 0; i < self.pairs.length; i++) {
            R18 = R18.add(self.pairs[i].realAssetsValue());
        }
        return R18;
    }   

    function bindPairs(UniwapV2Wallet storage self, UniswapV2PairLibrary.UniswapV2Pair[] memory pairs, address asset) internal returns (bool) {
        if (self.isBinded) {
            revert AlreadyBinded();
        }
        self.isBinded = true;
        for (uint256 i = 0; i < pairs.length; i += 1) {
            _bindPair(self, pairs[i]);
        }
        self.asset = asset;
        return true;
    }

    function deposit(UniwapV2Wallet storage self, Shares storage shares, ) {
        
    }


    function _sizeLimit() private pure returns (uint8) {
        return 16;
    }

    function _bindPair(UniswapV2Wallet storage self, UniswapV2PairLibrary.UniswapV2Pair memory pair) private returns (bool) {

        if (self.pairs.length >= _sizeLimit()) {

        }


    }
}