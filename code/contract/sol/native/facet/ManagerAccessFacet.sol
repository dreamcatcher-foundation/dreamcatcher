// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../storage/auth/AuthStorage.sol";
import "../storage/MarketStorage.sol";
import "../util/math/FinanceMathLib.sol";
import "../util/adaptor/TokenAddressAdaptorLib.sol";

contract ManagerAccessFacet is MarketStorage, AuthStorage {
    using MarketStorageLib for MarketStorageLib.Market;
    using AuthStorageLib for AuthStorageLib.Auth;
    using FinanceMathLib for FinanceMathLib.LiquidityCheckPayload;
    using TokenAddressAdaptorLib for address;

    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory response = new bytes4[](4);
        response[0] = bytes4(keccak256("enableToken(address)"));
        response[1] = bytes4(keccak256("disableToken(address)"));
        response[2] = bytes4(keccak256("buy(uint256,uint256)"));
        response[3] = bytes4(keccak256("sell(uint256,uint256)"));
        return response;
    }

    function enableToken(address token) external returns (bool) {
        auth().onlyMembersOf("managers");
        FinanceMathLib.LiquidityCheckPayload memory liqCheck;
        liqCheck.assetsInR64 = 1000000000000000000000000000000000000000000000000000000000000000000;
        liqCheck.token = token;
        liqCheck.asset = market().asset();
        liqCheck.uniswapV2Factory = market().uniswapV2Factory();
        liqCheck.uniswapV2Router = market().uniswapV2Router();
        liqCheck.threshold = market().maximumSlippageAsBasisPoint();
        require(liqCheck.hasEnoughLiquidity(), "ManagerAccessFacet: token has failed a liquidity check");
        market().enableToken(token);
        return true;
    }

    function disableToken(address token) external returns (bool) {
        auth().onlyMembersOf("managers");
        require(token.balanceR64() == 0, "ManagerAccessFacet: cannot disable token when its balance is not 0");
        market().disableToken(token);
        return true;
    }

    function buy(uint256 tokenId, uint256 amountInR64) external returns (uint256 r64) {
        auth().onlyMembersOf("managers");
        return market().buy(tokenId, amountInR64);
    }

    function sell(uint256 tokenId, uint256 amountInR64) external returns (uint256 r64) {
        auth().onlyMembersOf("managers");
        return market().sell(tokenId, amountInR64);
    }
}