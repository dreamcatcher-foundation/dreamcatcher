// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { FixedPointEngine } from "./FixedPointEngine.sol";
import { Math as OpenzeppelinMath } from "./imports/openzeppelin/utils/math/Math.sol";

contract VendorEngine is FixedPointEngine {
    uint256 constant private _INITIAL_MINT = 1000 ether;

    function _amountToMint(uint256 assetsIn, uint256 totalAssets, uint256 totalSupply) internal pure returns (uint256) {
        if (totalAssets == 0 && totalSupply == 0) return _INITIAL_MINT;

        if (totalAssets != 0 && totalSupply == 0) return _INITIAL_MINT;

        if (totalAssets == 0 && totalSupply != 0) return 0;

        return OpenzeppelinMath.mulDiv(assetsIn, totalSupply, totalAssets);
    }

    function _amountToSend(uint256 supplyIn, uint256 totalAssets, uint256 totalSupply) internal pure returns (uint256) {
        if (totalAssets == 0 && totalSupply == 0) return 0;

        if (totalAssets != 0 && totalSupply == 0) return 0;

        if (totalAssets == 0 && totalSupply != 0) return 0;

        return OpenzeppelinMath.mulDiv(supplyIn, totalSupply, totalAssets);
    }
}