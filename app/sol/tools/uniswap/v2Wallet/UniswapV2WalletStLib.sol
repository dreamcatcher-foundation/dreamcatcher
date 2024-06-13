// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { UniswapV2Wallet } from "./UniswapV2Wallet.sol";
import { UniswapV2Pair } from "../v2Pair/UniswapV2Pair.sol";
import { UniswapV2PairLib } from "../v2Pair/UniswapV2PairLib.sol";
import { UniswapV2PairStLib } from "../v2Pair/UniswapV2PairStLib.sol";
import { FixedPointValue } from "../../math/fixedPoint/FixedPointValue.sol";
import { FixedPointValueArithmeticLib } from "../../math/fixedPoint/FixedPointValueArithmeticLib.sol";
import { TransferLib } from "../../logic/TransferLib.sol";
import { VaultMathLib } from "../../math/VaultMathLib.sol";

library UniswapV2WalletStLib {
    error PairMustBeMeasuredAgainstTheWalletAsset();
    error InvalidPair();
    error WalletSizeLimit();
    error DuplicateToken();
    error WalletIsNotInitialized();

    enum WithdrawalOption {
        InAsset,
        InKind
    }

    function netBestAssets(UniswapV2Wallet storage wallet) internal view returns (FixedPointValue memory asEther) {
        if (!wallet.initialized) {

        }
        FixedPointValue memory result = FixedPointValue({ value: 0, decimals: 18 });
        for (uint256 i = 0; i < wallet.pairs.length; i++) {
            result = FixedPointValueArithmeticLib.add(result, UniswapV2PairStLib.bestAssets(wallet.pairs[i]));
        }
        return result;
    }

    function netRealAssets(UniswapV2Wallet storage wallet) internal view returns (FixedPointValue memory asEther) {
        FixedPointValue memory result = FixedPointValue({ value: 0, decimals: 18 });
        for (uint256 i = 0; i < wallet.pairs.length; i++) {
            result = FixedPointValueArithmeticLib.add(result, UniswapV2PairStLib.realAssets(wallet.pairs[i]));
        }
        return result;
    }

    function initialize(UniswapV2Wallet storage wallet, UniswapV2Pair[] memory pairs, address asset) internal returns (bool) {
        require(!wallet.initialized, "UniswapV2WalletStLib: already initialized");
        for (uint256 i = 0; i < pairs.length; i += 1) {
            _registerPair(wallet, pairs[i]);
        }
        wallet.asset = asset;
        return true;
    }

    function deposit(UniswapV2Wallet storage wallet, Token storage token, FixedPointValue memory assetsIn) internal {
        Vault memory vault = Vault({ assetsOrSupplyIn: assetsIn, assets: netRealAssets(wallet), supply: TokenLib.totalSupply(token) });
        (FixedPointValue memory amountToMint, Result result) = VaultMathLib.amountToMint(vault);
        if (result != Result.Ok) {}
        TransferLib.request(wallet.asset, assetsIn);
        TokenLib.mint(token, msg.sender, amountToMint);
        return true;
    }

    function withdraw(UniswapV2Wallet storage wallet, Token storage token, FixedPointValue memory supplyIn, WithdrawalOption option) {
        Vault memory vault = 
        (FixedPointValue memory amountToSend, Result result) 
            = VaultMathLib.amountToSend(Vault({
                assetsOrSupplyIn: supplyIn,
                assets: netRealAssets(wallet),
                supply: TokenLib.totalSupply(token)
            }));
        // get portion of the overal value


        if (option == WithdrawalOption.InKind) {

        }

        
    }

    function _checkInitialized(UniswapV2Wallet storage wallet) private pure returns (bool) {
        if (!wallet.initialized) {
            revert WalletIsNotInitialized();
        }
        return true;
    }

    function _sizeLimit() private pure returns (uint8) {
        return 16;
    }

    function _reverse(address[] memory path) private pure returns (address[] memory) {
        address[] memory reversedPath = new address[](path.length);
        for (uint256 i = 0; i < path.length; i++) {
            reversedPath[i] = path[path.length - 1 - i];
        }
        return reversedPath;
    }

    /**
    * -> Pairs must be registered before the launch of the vaults, at the start
    *    owners can pick a set of pairs from different exchanges that
    *    they can trade between.
     */
    function _registerPair(UniswapV2Wallet storage wallet, UniswapV2Pair memory pair) private returns (bool) {

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
}