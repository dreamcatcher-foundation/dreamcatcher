// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Result, Ok, Err } from "./Result.sol";
import { FixedPointMath } from "./FixedPointMath.sol";

library VendorLib {
    using FixedPointMath for uint256;

    function mint(uint256 assetsIn, uint256 totalAssets, uint256 totalSupply) internal pure returns (Result memory, uint256) {
        if (totalAssets == 0 && totalSupply == 0) return (Ok(), 1000000 ether);

        if (totalAssets != 0 && totalSupply == 0) return (Ok(), 1000000 ether);

        if (totalAssets == 0 && totalSupply != 0) return (Ok(), 0);

        return assetsIn.muldiv(totalSupply, totalAssets);
    }

    function burn(uint256 supplyIn, uint256 totalAssets, uint256 totalSupply) internal pure returns (Result memory, uint256) {
        if (totalAssets == 0 && totalSupply == 0) return (Ok(), 0);

        if (totalAssets != 0 && totalSupply == 0) return (Ok(), 0);

        if (totalAssets == 0 && totalSupply != 0) return (Ok(), 0);

        return supplyIn.muldiv(totalAssets, totalSupply);
    }
}