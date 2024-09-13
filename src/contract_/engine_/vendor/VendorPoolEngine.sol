// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {FixedPointEngine} from "../math/FixedPointEngine.sol";

abstract contract VendorPoolEngine is FixedPointEngine {

    function _previewMint(uint256 assetsIn, uint256 totalAssets, uint256 totalSupply) internal pure returns (uint256) {
        return
            assetsIn == 0 ? 0 :

            totalAssets == 0 && totalSupply == 0 ? _initialMint() :
            totalAssets != 0 && totalSupply == 0 ? _initialMint() :
            totalAssets == 0 && totalSupply != 0 ? 0 :

            _div(_mul(assetsIn, totalSupply), totalAssets);
    }

    function _previewBurn(uint256 supplyIn, uint256 totalAssets, uint256 totalSupply) internal pure returns (uint256) {
        return
            supplyIn == 0 ? 0 :

            totalAssets == 0 && totalSupply == 0 ? 0 :
            totalAssets != 0 && totalSupply == 0 ? 0 :
            totalAssets == 0 && totalSupply != 0 ? 0 :

            _div(_mul(supplyIn, totalAssets), totalSupply);
    }

    function _initialMint() private pure returns (uint256) {
        return 1000000e18;
    }
}