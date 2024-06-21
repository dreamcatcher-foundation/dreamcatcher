// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { OwnableTokenController } from "./OwnableTokenController.sol";
import { RebalanceEngine } from "./RebalanceEngine.sol";

interface IVault {
    function previewMint(uint256 assetsIn) external view returns (uint256);
    function previewBurn(uint256 supplyIn) external view returns (uint256);
    function totalSupply() external view returns (uint256);
    function totalAssets() external view returns (uint256);
    function mint(uint256 assetsIn) external returns (bool);
    function burn(uint256 supplyIn) external returns (bool);
}

contract Vault is Ownable, OwnableTokenController, RebalanceEngine, VendorEngine {
    address constant internal _DENOMINATION = 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359;
    address constant internal _FACTORY = 0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32;
    address constant internal _ROUTER = 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff;

    Slot[50] internal _slots;

    struct Slot {
        SlotResult result;
        /***/address token;
        /***/uint256 targetAllocation;
        uint256 actualAllocation;
        uint256 targetBalance;
        uint256 actualBalance;
        uint256 surplusBalance;
        uint256 deficitBalance;
        TotalValue totalValue;
    }

    enum SlotResult {
        OK,
        ZERO_TOTAL_ASSETS,
        INSUFFICIENT_LIQUIDITY,
        INSUFFICIENT_INPUT_AMOUNT,
        ADDRESS_NOT_FOUND,
        MISSING_REQUIRED_DATA,
        SLIPPAGE_EXCEEDS_THRESHOLD,
        INSUFFICIENT_BALANCE,
        UNKNOWN_ERROR
    }

    enum CacheResult {
        OK,
        DENOMINATION_IS_PROTECTED,
        SLOT_NOT_FOUND,
        ALREADY_CACHED,
        SLOTS_ARE_FULL,
        UNSUPPORTED_TOKEN
    }

    constructor(address ownableToken) OwnableTokenController(ownableToken) {
        Slot storage slot = _slots[0];
        slot.token = _DENOMINATION;

        /** For testing */
        _slots[1].token = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619; /** WETH */
        _slots[2].token = 0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6; /** WBTC */
        _slots[3].token = 0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39; /** LINK */
        _slots[4].token = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270; /** WMATIC */
    }

    function previewMint(uint256 assetsIn) public view returns (uint256) {
        return _amountToMint(assetsIn, totalAssets(), totalSupply());
    }

    function previewBurn(uint256 supplyIn) public view returns (uint256) {
        return _amountToSend(supplyIn, totalAssets(), totalSupply());
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply();
    }

    function totalAssets() public view returns (uint256) {
        uint256 result = _cast(IERC20(_DENOMINATION).balanceOf(address(this)), IERC20Metadata(_DENOMINATION).decimals(), 18);
        for (uint8 i = 1; i < _slots.length; i += 1) {
            Slot storage slot = _slots[i];
            if (slot.token != address(0)) {
                Asset memory asset;
                asset.exchange.factory = _FACTORY;
                asset.exchange.router = _ROUTER;
                asset.token = slot.token;
                asset.denomination = _DENOMINATION;
                asset = _fetchAssetData(asset);
                if (asset.result == RebalanceEngineResult.OK && asset.totalValue.result == RebalanceEngineResult.OK) {
                    result += asset.totalValue.value;
                }
            }
        }
        return result;
    }

    function _fetchSlotData(Slot memory slot) private view returns (Slot memory) {
        if (slot.token == address(0)) {
            slot.result = SlotResult.MISSING_REQUIRED_DATA;
            return slot;
        }
        if (totalAssets() == 0) {
            slot.result = SlotResult.ZERO_TOTAL_ASSETS;
            return slot;
        }
        Asset memory asset;
        asset.exchange.factory = _FACTORY;
        asset.exchange.router = _ROUTER;
        asset.token = slot.token;
        asset.denomination = _DENOMINATION;
        asset = _fetchAssetData(asset);
        slot.result = SlotResult.OK;
        slot.actualBalance = asset.balance;
        if (asset.totalValue.result != RebalanceEngineResult.OK) {
            slot.totalValue.result =
                asset.totalValue.result == RebalanceEngineResult.INSUFFICIENT_LIQUIDITY ? SlotResult.INSUFFICIENT_LIQUIDITY :
                asset.totalValue.result == RebalanceEngineResult.INSUFFICIENT_INPUT_AMOUNT ? SlotResult.INSUFFICIENT_INPUT_AMOUNT :
                asset.totalValue.result == RebalanceEngineResult.ADDRESS_NOT_FOUND ? SlotResult.ADDRESS_NOT_FOUND :
                asset.totalValue.result == RebalanceEngineResult.MISSING_REQUIRED_DATA ? SlotResult.MISSING_REQUIRED_DATA :
                asset.totalValue.result == RebalanceEngineResult.SLIPPAGE_EXCEEDS_THRESHOLD ? SlotResult.SLIPPAGE_EXCEEDS_THRESHOLD :
                asset.totalValue.result == RebalanceEngineResult.INSUFFICIENT_BALANCE ? SlotResult.INSUFFICIENT_BALANCE :
                asset.totalValue.result == RebalanceEngineResult.UNKNOWN_ERROR : SlotResult.UNKNOWN_ERROR : SlotResult.UNKNOWN_ERROR;
            return asset;
        }
        slot.totalValue = totalValue;
        slot.actualAllocation = _mul(_div(slot.totalValue / totalAssets()), _ONE_HUNDRED_PERCENT);
        slot.targetBalance = _mul(_div(totalAssets(), _ONE_HUNDRED_PERCENT), slot.targetAllocation);
        if (slot.actualBalance > slot.targetBalance) {
            slot.surplusBalance = _sub(slot.actualBalance, slot.targetBalance);
            return slot;
        }
        if (slot.actualBalance < slot.targetBalance) {
            slot.deficitBalance = _sub(slot.targetBalance, slot.actualBalance);
            return slot;
        }
        return slot;
    }


    function _isSupported(address token) private view returns (bool) {
        if (IERC20Metadata(token).decimals() < 2 || IERC20Metadata(token).decimals() > 18) {
            return false;
        }
        return true;
    }

    function _isCached(address token) private view returns (uint8, bool) {
        for (uint8 i = 0; i < _slots.length; i += 1) {
            Slot storage slot = _slots[i];
            if (slot.token == token) {
                return (i, true);
            }
        }
        return (0, false);
    }


    function _cache(address token) private returns (CacheResult) {
        if (_isCached(token)) {
            return CacheResult.ALREADY_CACHED;
        }
        if (!_isSupported(token)) {
            return CacheResult.UNSUPPORTED_TOKEN;
        }
        (uint8 position, bool success) = _isCached(address(0));
        if (!success) {
            return CacheResult.SLOTS_ARE_FULL;
        }
        Slot storage slot = _slots[position];
        slot.token = token;
        return CacheResult.OK;
    }

    function _forget(address token) private returns (CacheResult) {
        (uint8 position, bool success) = _isCached(token);
        if (success && position == 0) {
            return CacheResult.DENOMINATION_IS_PROTECTED;
        }
        if (!success) {
            return CacheResult.SLOT_NOT_FOUND;
        }
        Slot storage slot = _slots[position];
        slot.token = address(0);
        return CacheResult.OK;
    }
}