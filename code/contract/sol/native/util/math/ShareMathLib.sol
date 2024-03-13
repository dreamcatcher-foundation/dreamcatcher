// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library ShareMathLib {
    struct Payload {
        uint256 assetsOrSharesInR64;
        uint256 totalAssetsR64;
        uint256 totalSupplyR64;
    }

    function asAssets(Payload memory payload) internal pure returns (uint256 r64) {
        return (payload.assetsOrSharesInR64 * payload.totalAssetsR64) / payload.totalSupplyR64;
    }

    function asShares(Payload memory payload) internal pure returns (uint256 r64) {
        return (payload.assetsOrSharesInR64 * payload.totalSupplyR64) / payload.totalAssetsR64;
    }
}