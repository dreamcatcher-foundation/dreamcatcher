// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library ShareMathLib {
    struct Payload {
        uint amountInR64,
        uint totalAssetsR64,
        uint totalSupplyR64
    }

    /**
     * @dev Calculates the asset amount equivalent to the given share amount.
     * @param payload The payload containing share amount, total assets, and total supply of shares.
     * @return r64 The asset amount in Dreamcatcher native r64 representation.
     */
    function asAssets(Payload payload) internal pure returns (uint r64) {
        return (payload.amountInR64 * payload.totalAssetsR64) / payload.totalSupplyR64;
    }

    /**
     * @dev Calculates the share amount equivalent to the given asset amount.
     * @param payload The payload containing asset amount, total assets, and total supply of shares.
     * @return r64 The share amount in Dreamcatcher native r64 representation.
     */
    function asShares(Payload payload) internal pure returns (uint r64) {
        return (payload.amountInR64 * payload.totalSupplyR64) / payload.totalAssetsR64;
    }
}