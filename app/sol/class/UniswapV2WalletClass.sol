// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { UniswapV2PairClass } from "./UniswapV2PairClass.sol";
import { FixedPointValueClass } from "./FixedPointValueClass.sol";

library UniswapV2WalletClass {
    using UniswapV2PairClass for UniswapV2PairClass.UniswapV2Pair;
    using FixedPointValueClass for FixedPointValueClass.FixedPointValue;

    error InvalidPair();
    error AlreadyBinded();
    error NotBinded();
    error SizeLimitReached();
    error BaseTokenMustBeAsset();

    struct UniswapV2Wallet {
        UniswapV2PairClass.UniswapV2Pair[] pairs;
        address asset;
        bool isBinded;
    }

    function totalBestAssets(UniswapV2Wallet storage self) internal view returns (FixedPointValueClass.FixedPointValue memory r18) {
        if (!self.isBinded) {
            revert NotBinded();
        }
        FixedPointValueClass.FixedPointValue memory result = FixedPointValueClass.FixedPointValue({ value: 0, decimals: 18 });
        for (uint256 i = 0; i < self.pairs.length; i += 1) {
            result = result.add(self.pairs[i].totalBestAssets());
        }
        return result;
    }

    function totalRealAssets(UniswapV2Wallet storage self) internal view returns (FixedPointValueClass.FixedPointValue memory r18) {
        if (!self.isBinded) {
            revert NotBinded();
        }
        FixedPointValueClass.FixedPointValue memory result = FixedPointValueClass.FixedPointValue({ value: 0, decimals: 18 });
        for (uint256 i = 0; i < self.pairs.length; i += 1) {
            result = result.add(self.pairs[i].totalRealAssets());
        }
        return result;
    }

    function bindPairs(UniswapV2Wallet storage self, UniswapV2PairClass.UniswapV2Pair[] memory pairs, address asset) internal return (bool) {
        if (self.isBinded) {
            revert AlreadyBinded();
        }
        self.isBinded = true;
        for (uint256 i = 0; i < self.pairs.length; i += 1) {
            _bindPair(self, pairs[i]);
        }
        self.asset = asset;
        return true;
    }

    function _sizeLimit() private pure returns (uint8) {
        return 16;
    }

    function _bindPair(UniswapV2Wallet storage self, UniswapV2PairClass.UniswapV2Pair memory pair) private returns (bool) {
        /**
        * -> The size limit protects the contract from creating expensive computations
        *    which would have to be paid by the user when depositing or withdrawing. Each
        *    pair needs to make some heavy calls to ensure the math is correct, and to
        *    keep everything reasonable the limit ensures calls are cheap and
        *    accessible to everyone.
         */
        if (self.pairs.length >= _sizeLimit()) revert SizeLimitReached();

        /**
        * -> The pair's `path` must contain the wallet's asset which is also
        *    set before the vault's launch. All pairs must be measured against
        *    the same asset for accounting purposes.
         */
        if (pair.path.lastToken() != self.asset) revert BaseTokenMustBeAsset();

        /** -> The pair cannot be worthless. */
        if (pair.quote() == 0) revert InvalidPair();

        for (uint256 i = 0; i < self.pairs.length; i += 1) {
            /**
            * -> Each pair must have a unique token, even if it points to a different
            *    factory and router. This is because amounts and accounting is done assuming
            *    each pair is a unique token, so having the same token in multitple factories
            *    and routers would cause duplicate calculations.
             */
            if (self.pairs[i].path.lastToken() == pair.path.lastToken()) revert 
        }

        self.pairs.push(pair);
        return true;
    }
}