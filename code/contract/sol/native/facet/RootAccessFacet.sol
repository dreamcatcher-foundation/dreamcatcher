// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../storage/auth/AuthStorage.sol";
import "../storage/asset/TokenStorage.sol";
import "../storage/MarketStorage.sol";
import "../util/action/PaymentActionLib.sol";
import "../util/math/UintConversionMathLib.sol";

contract RootAccessFacet is AuthStorage, TokenStorage, MarketStorage {
    using AuthStorageLib for AuthStorageLib.Auth;
    using TokenStorageLib for TokenStorageLib.Token;
    using MarketStorageLib for MarketStorageLib.Market;
    using PaymentActionLib for address;
    using UintConversionMathLib for UintConversionMathLib.ConversionPayload;

    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory response = new bytes4[](11);
        response[0] = bytes4(keccak256("setName(string)"));
        response[1] = bytes4(keccak256("setSymbol(string)"));
        response[2] = bytes4(keccak256("setAsset(address)"));
        response[3] = bytes4(keccak256("setUniswapV2Factory(address)"));
        response[4] = bytes4(keccak256("setUniswapV2Router(address)"));
        response[5] = bytes4(keccak256("setMaximumSlippageAsBasisPoint(uint256)"));
        response[6] = bytes4(keccak256("mint(address,uint256)"));
        response[7] = bytes4(keccak256("burn(address,uint256)"));
        response[8] = bytes4(keccak256("grantRoleTo(string,address)"));
        response[9] = bytes4(keccak256("revokeRoleFrom(string,address)"));
        response[10] = bytes4(keccak256("liqLock()"));
        return response;
    }

    function setName(string memory name) external returns (bool) {
        auth().onlyMembersOf("*");
        token().setName(name);
        return true;
    }

    function setSymbol(string memory symbol) external returns (bool) {
        auth().onlyMembersOf("*");
        token().setSymbol(symbol);
        return true;
    }

    function setAsset(address token) external returns (bool) {
        auth().onlyMembersOf("*");
        market().setAsset(token);
        return true;
    }

    function setUniswapV2Factory(address uniswapV2Factory) external returns (bool) {
        auth().onlyMembersOf("*");
        market().setUniswapV2Factory(uniswapV2Factory);
        return true;
    }

    function setUniswapV2Router(address uniswapV2Router) external returns (bool) {
        auth().onlyMembersOf("*");
        market().setUniswapV2Router(uniswapV2Router);
        return true;
    }

    function setMaximumSlippageAsBasisPoint(uint256 maximumSlippageAsBasisPoint) external returns (bool) {
        auth().onlyMembersOf("*");
        market().setMaximumSlippageAsBasisPoint(maximumSlippageAsBasisPoint);
        return true;
    }

    function mint(address account, uint256 amount) external returns (bool) {
        auth().onlyMembersOf("*");
        token().mint(account, amount);
        return true;
    }

    function burn(address account, uint256 amount) external returns (bool) {
        auth().onlyMembersOf("*");
        token().burn(account, amount);
        return true;
    }

    function grantRoleTo(string memory role, address account) external returns (bool) {
        auth()
            .onlyMembersOf("*")
            .grantRoleTo(role);
        return true;
    }

    function revokeRoleFrom(string memory role, address account) external returns (bool) {
        auth()
            .onlyMembersOf("*")
            .revokeRoleFrom(role, account);
        return true;
    }

    function liqLock() external returns (bool) {
        auth()
            .onlyMembersOf("*");
        UintConversionMathLib.ConversionPayload memory assetsR64 = 
        UintConversionMathLib.ConversionPayload({
            value: 100,
            oldDecimals: 2,
            newDecimals: 64
        });
        UintConversionMathLib.ConversionPayload memory tokensR64 =
        UintConversionMathLib.ConversionPayload({
            value: 100,
            oldDecimals: 2,
            newDecimals: 64
        });
        market()
            .asset()
            .requestToken(assetsR64.asNew());
        token()
            .mint(address(this), tokensR64.asNew());
        return true;
    }
}