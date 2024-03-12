// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import '../../../non-native/openzeppelin/utils/structs/EnumerableSet.sol';
import '../../util/FinanceMathLibrary.sol';
import '../../util/UniswapV2PairLibrary.sol';
import '../asset/TokenStorage.sol';

library VaultStorageLibrary {
    using EnumerableSet for EnumerableSet.AddressSet;

    struct Vault {
        Hidden hidden;
    }

    struct Hidden {
        EnumerableSet.AddressSet holdings;
        address asset;
        address uniswapV2Factory;
        address uniswapV2Router02;
    }

    function holdings(Vault storage vault) internal view returns (address[] memory) {
        return vault.hidden.holdings.values();
    }

    function asset(Vault storage vault) internal view returns (address) {
        return vault.hidden.asset;
    }

    function uniswapV2Factory(Vault storage vault) internal view returns (address) {
        return vault.hidden.uniswapV2Factory;
    }

    function uniswapV2Router02(Vault storage vault) internal view returns (address) {
        return vault.hidden.uniswapV2Router02;
    }

    function enableToken(Vault storage vault, address token) internal returns (Vault storage) {
        address[] memory path = new address[](2);
        path[0] = token;
        path[1] = asset(vault);

        uint256 tokenQuoteAsEther = UniswapV2PairLibrary.quote(token, asset(value), uniswapV2Factory(value), uniswapV2Router02(value));
        uint256 tokenBalanceAsEther = 
        UniswapV2PairLibrary.slippage(path, uniswapV2Factory, uniswapV2Router02, amountAsEther);
    }
}