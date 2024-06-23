// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IUniswapV2Router02 } from "./imports/uniswap/interfaces/IUniswapV2Router02.sol";
import { IERC20Metadata } from "./imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { IERC20 } from "./imports/openzeppelin/token/ERC20/IERC20.sol";
import { OwnableTokenController } from "./OwnableTokenController.sol";
import { RebalanceEngine } from "./RebalanceEngine.sol";
import { VendorEngine } from "./VendorEngine.sol";
import { Ownable } from "./imports/openzeppelin/access/Ownable.sol";

interface IVault {
    function previewMint(uint256 assetsIn) external view returns (uint256);
    function previewBurn(uint256 supplyIn) external view returns (uint256);
    function totalSupply() external view returns (uint256);
    function totalAssets() external view returns (uint256);
    function rebalance(uint256[50] memory allocations) external returns (bool);
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
        uint256 targetAllocation;
        uint256 actualAllocation;
        uint256 targetBalance;
        uint256 actualBalance;
        uint256 surplusBalance;
        uint256 deficitBalance;
        uint256 targetValue;
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

    constructor(address ownableToken) OwnableTokenController(ownableToken) 
    Ownable(msg.sender) {
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

    function buyDeficit(address token, uint256 allocation) public returns (bool) {
        require(token != address(0), "token is zero address");
        (uint8 p, bool success) = _isCached(token);
        require(success, "unable to find token");
        Slot storage slot = _slots[p];
        Slot memory cargo;
        cargo.token = slot.token;
        cargo.targetAllocation = allocation;
        cargo = _fetchSlotData(cargo);
        require(cargo.result == SlotResult.OK, "unable to fetch slot data");
        require(cargo.deficitBalance > 0, "token does not have a deficit");
        SwapRequest memory request;
        request.exchange.factory = _FACTORY;
        request.exchange.router = _ROUTER;
        request.tokenIn = _DENOMINATION;
        request.tokenOut = cargo.token;
        request.amountIn = cargo.targetValue - cargo.totalValue.value;
        request.slippageThreshold = 5 ether;
        (uint256 amountOut, UniswapEngineResult result) = _swap(request);
        if (result == UniswapEngineResult.OK) {
            
        }
    //    return true;
    //}

    function sellSurplus(address token, uint256 allocation) public returns (bool) {
        require(token != address(0), "token is zero address");
        (uint8 p, bool success) = _isCached(token);
        require(success, "unable to find token");
        Slot storage slot = _slots[p];
        Slot memory cargo;
        cargo.token = slot.token;
        cargo.targetAllocation = allocation;
        cargo = _fetchSlotData(cargo);
        require(cargo.result == SlotResult.OK, "unable to fetch slot data");
        require(cargo.surplusBalance > 0, "token does not have a surplus");
        SwapRequest memory request;
        request.exchange.factory = _FACTORY;
        request.exchange.router = _ROUTER;
        request.tokenIn = cargo.token;
        request.tokenOut = _DENOMINATION;
        request.amountIn = cargo.surplusBalance;
        request.slippageThreshold = 2 ether;
        (uint256 amountOut, UniswapEngineResult result) = _swap(request);
        if (result == UniswapEngineResult.SLIPPAGE_EXCEEDS_THRESHOLD) {
            revert("missing required data");
        }
    }

    function mint(uint256 assetsIn) public returns (bool) {
        uint256 amountToMint = previewMint(assetsIn);
        if (amountToMint == 0) {
            revert("Vault: you would receive nothing in return");
        }
        uint8 decimals = IERC20Metadata(_DENOMINATION).decimals();
        if (_cast(IERC20(_DENOMINATION).balanceOf(msg.sender), decimals, 18) < assetsIn) {
            revert("Vault: insufficient balance");
        }
        IERC20(_DENOMINATION).transferFrom(msg.sender, address(this), _cast(assetsIn, 18, decimals));
        _mint(msg.sender, amountToMint);
        return true;
    }

    function burn(uint256 supplyIn) public returns (bool) {
        uint256 amountToSend = previewBurn(supplyIn);
        if (amountToSend == 0) {
            revert("Vault: you would receive nothing in return");
        }
        _burn(msg.sender, supplyIn);
        uint256 ownership = _mul(_div(amountToSend, totalAssets()), _ONE_HUNDRED_PERCENT);
        for (uint256 i = 1; i < _slots.length; i += 1) {
            Slot storage slot = _slots[i];
            Slot memory cargo;
            cargo.token = slot.token;
            cargo.targetAllocation = slot.targetAllocation;
            cargo = _fetchSlotData(cargo);
            if (cargo.result == SlotResult.OK) {
                uint256 balanceToSend = _mul(_div(cargo.actualBalance, _ONE_HUNDRED_PERCENT), ownership);
                SwapRequest memory request;
                request.tokenIn = cargo.token;
                request.tokenOut = _DENOMINATION;
                request.amountIn = balanceToSend;
                request.slippageThreshold = 5 ether;
                (uint256 amountOut, UniswapEngineResult result) = _swap(request);
                if (result == UniswapEngineResult.OK && amountOut != 0) {
                    uint8 decimals = IERC20Metadata(_DENOMINATION).decimals();
                    IERC20(_DENOMINATION).transfer(msg.sender, _cast(amountOut, 18, decimals));
                }
                else {
                    uint8 decimals = IERC20Metadata(cargo.token).decimals();
                    IERC20(cargo.token).transfer(msg.sender, _cast(balanceToSend, 18, decimals));
                }
            }
        }
        uint8 decimals = IERC20Metadata(_DENOMINATION).decimals();
        uint256 balance = IERC20(_DENOMINATION).balanceOf(address(this));
        uint256 balanceToSend = _mul(_div(_cast(balance, decimals, 18), _ONE_HUNDRED_PERCENT), ownership);
        IERC20(_DENOMINATION).transfer(msg.sender, _cast(balanceToSend, 18, decimals));
        return true;
    }

    function debug__fetchSlotData(
        address token,
        uint256 targetAllocation
    ) external view returns (Slot memory) {
        Slot memory slot;
        slot.token = token;
        slot.targetAllocation = targetAllocation;
        slot = _fetchSlotData(slot);
        return slot;
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
        if (slot.token == _DENOMINATION) {
            slot.result = SlotResult.OK;
            slot.actualBalance = _cast(IERC20(_DENOMINATION).balanceOf(address(this)), IERC20Metadata(_DENOMINATION).decimals(), 18);
            slot.totalValue.result = RebalanceEngineResult.OK;
            slot.totalValue.value = slot.actualBalance;
            slot.actualAllocation = _mul(_div(slot.totalValue.value, totalAssets()), _ONE_HUNDRED_PERCENT);
            slot.targetValue = _mul(_div(totalAssets(), _ONE_HUNDRED_PERCENT), slot.targetAllocation);
            slot.targetBalance = _mul(_div(totalSupply(), _ONE_HUNDRED_PERCENT), slot.targetAllocation);
            if (slot.actualBalance > slot.targetBalance) {
                slot.surplusBalance = _sub(slot.actualBalance, slot.targetBalance);
                return slot;
            }
            if (slot.actualBalance < slot.targetBalance) {
                slot.deficitBalance = _sub(slot.targetBalance, slot.actualBalance);
                return slot;
            }
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
            slot.totalValue.result = asset.totalValue.result;
            return slot;
        }
        slot.totalValue.value = asset.totalValue.value;
        slot.actualAllocation = _mul(_div(slot.totalValue.value, totalAssets()), _ONE_HUNDRED_PERCENT);
        slot.targetValue = _mul(_div(totalAssets(), _ONE_HUNDRED_PERCENT), slot.targetAllocation);
        Pair memory pair;
        pair.exchange.factory = _FACTORY;
        pair.exchange.router = _ROUTER;
        pair.token0 = slot.token;
        pair.token1 = _DENOMINATION;
        pair.amountIn1 = slot.targetValue;
        pair = _fetchPairData(pair);
        if (pair.quote1.result != UniswapEngineResult.OK) {
            return slot;
        }
        slot.targetBalance = pair.quote1.value;
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

    //function _isSupported(address token) private view returns (bool) {
    //    if (IERC20Metadata(token).decimals() < 2 || IERC20Metadata(token).decimals() > 18) {
    //        return false;
    //    }
    //    return true;
    //}

    function _isCached(address token) private view returns (uint8, bool) {
        for (uint8 i = 0; i < _slots.length; i += 1) {
            Slot storage slot = _slots[i];
            if (slot.token == token) {
                return (i, true);
            }
        }
        return (0, false);
    }


    //function _cache(address token) private returns (CacheResult) {
    //    (, bool cached) = _isCached(token);
    //    if (cached) {
    //        return CacheResult.ALREADY_CACHED;
    //    }
    //    //if (!_isSupported(token)) {
    //    //    return CacheResult.UNSUPPORTED_TOKEN;
    //    //}
    //    (uint8 position, bool success) = _isCached(address(0));
    //    if (!success) {
    //        return CacheResult.SLOTS_ARE_FULL;
    //    }
    //    Slot storage slot = _slots[position];
    //    slot.token = token;
    //    return CacheResult.OK;
    //}

    //function _forget(address token) private returns (CacheResult) {
    //    (uint8 position, bool success) = _isCached(token);
    //    if (success && position == 0) {
    //        return CacheResult.DENOMINATION_IS_PROTECTED;
    //    }
    //    if (!success) {
    //        return CacheResult.SLOT_NOT_FOUND;
    //    }
    //    Slot storage slot = _slots[position];
    //    slot.token = address(0);
    //    return CacheResult.OK;
    //}
}