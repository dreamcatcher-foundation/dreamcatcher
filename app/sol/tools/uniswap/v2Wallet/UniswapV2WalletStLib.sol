// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { UniswapV2Wallet } from "./UniswapV2Wallet.sol";
import { UniswapV2Pair } from "../v2Pair/UniswapV2Pair.sol";
import { UniswapV2PairLib } from "../v2Pair/UniswapV2PairLib.sol";

library UniswapV2WalletStLib {
    error PairMustBeMeasuredAgainstTheWalletAsset();
    error InvalidPair();
    error WalletSizeLimit();
    error DuplicateToken();

    /**
    * -> Pairs must be registered before the launch of the vaults, at the start
    *    owners can pick a set of pairs from different exchanges that
    *    they can trade between.
     */
    function registerPair(UniswapV2Wallet storage wallet, UniswapV2Pair memory pair) internal returns (bool) {

        /**
        * -> The size limit protects the contract from creating expensive computations
        *    which would have to be paid by the user when depositing or withdrawing. Each
        *    pair needs to make some heavy calls to ensure the math is correct, and to
        *    keep everything reasonable the limit ensures calls are cheap and
        *    accessible to everyone.
         */
        if (wallet.pairs.length >= _sizeLimit()) revert WalletSizeLimit();

        /**
        * -> The pair's `path` must contain the wallet's asset which is also
        *    set before the vault's launch. All pairs must be measured against
        *    the same asset for accounting purposes.
         */
        if (pair.path[0] != wallet.asset) revert PairMustBeMeasuredAgainstTheWalletAsset();
        
        /**
        * -> The pair cannot be worthless.
         */
        if (UniswapV2PairLib.quote(pair).value == 0) revert InvalidPair();
        
        for (uint8 i = 0; i < wallet.pairs.length; i++) {

            /**
            * -> Each pair must have a unique token, even if it points to a different
            *    factory and router. This is because amounts and accounting is done assuming
            *    each pair is a unique token, so having the same token in multitple factories
            *    and routers would cause duplicate calculations.
             */
            if (wallet.pairs[i].path[wallet.pairs[i].path.length - 1] == pair.path[pair.path.length - 1]) revert DuplicateToken();
        }

        wallet.pairs.push(pair);
        return true;
    }

    function _sizeLimit() private pure returns (uint8) {
        return 16;
    }
}