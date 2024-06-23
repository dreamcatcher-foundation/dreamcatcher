// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IERC20Metadata } from "./imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { IERC20 } from "./imports/openzeppelin/token/ERC20/IERC20.sol";
import { IUniswapAdaptor } from "./IUniswapAdaptor.sol";
import { FixedPointCalculator } from "./FixedPointCalculator.sol";
import { VTokenController } from "./VTokenController.sol";
import { Cooldown } from "./modifiers/Cooldown.sol";
import { Pair } from "./Pair.sol";
import { BalanceQueryResult } from "./BalanceQueryResult.sol";
import { SwapRequest } from "./SwapRequest.sol";
import { Asset } from "./Asset.sol";

/**
* Current limitations regardling the distribution and strength of
* the oracle, the limitations in pair routing, and some more work is
* still required but I think this should be good enough for a partial
* MVP.
*
* Dynamic slots features removed due to time contraints.
 */
contract Vault is FixedPointCalculator, VTokenController, Cooldown {
    address constant internal _DENOMINATION = 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359;
    address constant internal _FACTORY = 0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32;
    address constant internal _ROUTER = 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff;

    address[5] internal _slots;
    uint256[5] internal _weightings;
    IUniswapAdaptor internal _adaptor;

    constructor(address vToken, address adaptor, uint256[5] memory weightings) 
    VTokenController(vToken) 
    Cooldown(5 seconds) { 
        _slots[0] = _DENOMINATION; /// USDC
        _slots[1] = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619; /// WETH
        _slots[2] = 0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39; /// LINK
        _slots[3] = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270; /// WMATIC
        _slots[4] = 0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6; /// WBTC
        _adaptor = IUniswapAdaptor(adaptor);
        for (uint8 i = 0; i < weightings.length; i += 1) {
            _weightings[i] = weightings[i];
        }
    }

    function previewMint(uint256 assetsIn) public view returns (uint256) {
        return _amountToMint(assetsIn, totalAssets(), totalSupply());
    }

    function previewBurn(uint256 supplyIn) public view returns (uint256) {
        return _amountToSend(supplyIn, totalAssets(), totalSupply());
    }

    function totalAssets() public view returns (uint256) {
        uint256 result = _cast(IERC20(_DENOMINATION).balanceOf(address(this)), IERC20Metadata(_DENOMINATION).decimals(), 18);
        for (uint8 i = 1; i < _slots.length; i += 1) {
            address slot = _slots[i];
            if (slot != address(0)) {
                (BalanceQueryResult memory balanceQueryResult, bool success) = _getBalanceSheet(slot, _DENOMINATION, _weightings[i], 0);
                if (success) {
                    result += balanceQueryResult.actualValue;
                }
            }
        }
        return result;
    }

    function mint(uint256 assetsIn) public returns (bool) {
        uint256 mintable = previewMint(assetsIn);
        require(mintable != 0, "CALLER_WOULD_RECEIVE_NOTHING");
        uint8 decimals = IERC20Metadata(_DENOMINATION).decimals();
        uint256 balanceN = IERC20(_DENOMINATION).balanceOf(msg.sender);
        uint256 balance = _cast(balanceN, decimals, 18);
        require(balance >= assetsIn, "INSUFFICIENT_CALLER_BALANCE");
        uint256 assetsInN = _cast(assetsIn, 18, decimals);
        IERC20(_DENOMINATION).transferFrom(msg.sender, address(this), assetsInN);
        _mint(mintable);
        return true;
    }

    function burn(uint256 supplyIn) public returns (bool) {
        uint256 assetsOut = previewBurn(supplyIn);
        require(assetsOut != 0, "CALLER_WOULD_RECEIVE_NOTHING");
        _burn(supplyIn);
        uint256 ownership = _mul(_div(assetsOut, totalAssets()), 100 ether);
        for (uint8 i = 1; i < _slots.length; i += 1) {
            address slot = _slots[i];
            if (slot != address(0)) {
                address token0 = slot;
                address token1 = _DENOMINATION;
                (BalanceQueryResult memory balanceQueryResult, bool success) = _getBalanceSheet(token0, token1, _weightings[i], totalSupply());
                if (success) {
                    uint256 sendableBalance = _mul(_div(balanceQueryResult.actualBalance, 100 ether), ownership);
                    SwapRequest memory request;
                    request.tokenIn = token0;
                    request.tokenOut = token1;
                    request.amountIn = sendableBalance;
                    request.slippageThreshold = 5 ether;
                    (uint256 out, bool success) = _swap(_FACTORY, _ROUTER, token0, token1, sendableBalance, 2 ether);
                    if (success) {
                        uint8 decimals = IERC20Metadata(token1).decimals();
                        IERC20(token1).transfer(msg.sender, _cast(out, 18, decimals));
                    }
                    else {
                        uint8 decimals = IERC20Metadata(token0).decimals();
                        IERC20(token0).transfer(msg.sender, _cast(sendableBalance, 18, decimals));
                    }
                }
                else {
                    /** ... */
                }
            }
        }
        uint8 decimals = IERC20Metadata(_DENOMINATION).decimals();
        uint256 balanceN = IERC20(_DENOMINATION).balanceOf(address(this));
        uint256 balance = _cast(balanceN, decimals, 18);
        uint256 owedBalance = _mul(_div(balance, 100 ether), ownership);
        IERC20(_DENOMINATION).transfer(msg.sender, _cast(owedBalance, 18, decimals));
        return true;
    }

    function rebalance() public cooldown() {
        for (uint8 i = 1; i < _slots.length; i += 1) {
            _trySellSurplus(i);
        }
        for (uint8 i = 1; i < _slots.length; i += 1) {
            _tryBuyDeficit(i);
        }
    }

    function _amountToMint(uint256 assetsIn, uint256 totalAssets, uint256 totalSupply) internal pure returns (uint256) {
        if (totalAssets == 0 && totalSupply == 0) return 1000 ether;

        if (totalAssets != 0 && totalSupply == 0) return 1000 ether;

        if (totalAssets == 0 && totalSupply != 0) return 0;

        return _muldiv(assetsIn, totalSupply, totalAssets);
    }

    function _amountToSend(uint256 supplyIn, uint256 totalAssets, uint256 totalSupply) internal pure returns (uint256) {
        if (totalAssets == 0 && totalSupply == 0) return 0;

        if (totalAssets != 0 && totalSupply == 0) return 0;

        if (totalAssets == 0 && totalSupply != 0) return 0;

        return _muldiv(supplyIn, totalAssets, totalSupply);
    }

    function _getPair(address factory, address router, address token0, address token1) private view returns (Pair memory, bool) {
        Asset memory asset;
        asset.factory = factory;
        asset.router = router;
        asset.token0 = token0;
        asset.token1 = token1;
        try _adaptor.getPair(asset) returns (Pair memory pair) {
            return (pair, true);
        } 
        catch {
            Pair memory pair;
            return (pair, false);
        }
    }

    function _getBalanceSheet(address token0, address token1, uint256 targetWeight, uint256 totalAssets) private view returns (BalanceQueryResult memory, bool) {
        (Pair memory pair, bool success) = _getPair(_FACTORY, _ROUTER, token0, token1);
        if (!success) {
            BalanceQueryResult memory balanceQueryResult;
            return (balanceQueryResult, false);
        }
        try _adaptor.getBalanceSheet(pair, targetWeight, totalAssets) returns (BalanceQueryResult memory balanceQueryResult) {
            return (balanceQueryResult, true);
        }
        catch {
            BalanceQueryResult memory balanceQueryResult;
            return (balanceQueryResult, false);
        }
    }

    function _swap(address factory, address router, address tokenIn, address tokenOut, uint256 amountIn, uint256 slippageThreshold) private returns (uint256, bool) {
        SwapRequest memory request;
        request.factory = factory;
        request.router = router;
        request.tokenIn = tokenIn;
        request.tokenOut = tokenOut;
        request.amountIn = amountIn;
        request.slippageThreshold = slippageThreshold;
        try _adaptor.swap(request) returns (uint256 out) {
            return (out, true);
        }
        catch {
            return (0, false);
        }
    }

    function _tryBuyDeficit(uint8 slotIndex) private returns (bool) {
        address slot = _slots[slotIndex];
        if (slot == address(0)) {
            return false;
        }
        uint256 weighting = _weightings[slotIndex];
        (BalanceQueryResult memory query, bool success) = _getBalanceSheet(slot, _DENOMINATION, weighting, totalAssets());
        if (!success) {
            return false;
        }
        if (query.deficitBalance == 0) {
            return false;
        }
        uint256 amountIn = query.targetValue - query.actualValue;
        (uint256 out, bool success_) = _swap(_FACTORY, _ROUTER, _DENOMINATION, slot, amountIn, 100 ether);
        if (!success_) {
            return false;
        }
        return true;
    }

    function _trySellSurplus(uint8 slotIndex) private returns (bool) {
        address slot = _slots[slotIndex];
        if (slot == address(0)) {
            return false;
        }
        uint256 weighting = _weightings[slotIndex];
        (BalanceQueryResult memory query, bool success) = _getBalanceSheet(slot, _DENOMINATION, weighting, totalAssets());
        if (!success) {
            return false;
        }
        if (query.surplusBalance == 0) {
            return false;
        }
        (uint256 out, bool success_) = _swap(_FACTORY, _ROUTER, slot, _DENOMINATION, query.surplusBalance, 100 ether);
        if (!success_) {
            return false;
        }
        return true;
    }
}