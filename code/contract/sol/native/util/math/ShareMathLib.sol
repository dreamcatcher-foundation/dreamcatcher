// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library ShareMathLib {
    struct Payload {
        uint256 asssetsOrSharesInR64,
        uint256 totalAssetsR64,
        uint256 totalSupplyR64
    }

    function asAssets(Payload payload) internal pure returns (uint256 r64) {
        return (payload.asssetsOrSharesInR64 * payload.totalAssetsR64) / payload.totalSupplyR64;
    }

    function asShares(Payload payload) internal pure returns (uint256 r64) {
        return (payload.asssetsOrSharesInR64 * payload.totalSupplyR64) / payload.totalAssetsR64;
    }
}