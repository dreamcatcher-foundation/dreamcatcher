// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../storage/MarketStorage.sol";

contract MarketFacet is MarketStorage {
    using MarketStorageLib for MarketStorageLib.Market;

    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory response = new bytes4[](7);
        response[0] = bytes4(keccak256("enabledTokens()"));
        response[1] = bytes4(keccak256("enabledTokens(uint256)"));
        response[2] = bytes4(keccak256("hasEnabledToken(address)"));
        response[3] = bytes4(keccak256("asset()"));
        response[4] = bytes4(keccak256("uniswapV2Factory()"));
        response[5] = bytes4(keccak256("uniswapV2Router()"));
        response[6] = bytes4(keccak256("maximumSlippageAsBasisPoint()"));
        return response;
    }

    function enabledTokens() external view returns (address[] memory) {
        return market().enabledTokens();
    }

    function enabledTokens(uint256 tokenId) external view returns (address) {
        return market().enabledTokens(tokenId);
    }

    function hasEnabledToken(address token) external view returns (bool) {
        return market().hasEnabledToken(token);
    }

    function asset() external view returns (address) {
        return market().asset();
    }

    function uniswapV2Factory() external view returns (address) {
        return market().uniswapV2Factory();
    }

    function uniswapV2Router() external view returns (address) {
        return market().uniswapV2Router();
    }

    function maximumSlippageAsBasisPoint() external view returns (uint256 asBasisPoint) {
        return market().maximumSlippageAsBasisPoint();
    }
}