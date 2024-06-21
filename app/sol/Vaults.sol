// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IUniswapV2Router02 } from "./imports/uniswap/interfaces/IUniswapV2Router02.sol";
import { IUniswapV2Factory } from "./imports/uniswap/interfaces/IUniswapV2Factory.sol";
import { IUniswapV2Pair } from "./imports/uniswap/interfaces/IUniswapV2Pair.sol";
import { IERC20 } from "./imports/openzeppelin/token/ERC20/IERC20.sol";
import { IERC20Metadata } from "./imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { Ownable } from "./imports/openzeppelin/access/Ownable.sol";
import { ERC20 } from "./imports/openzeppelin/token/ERC20/ERC20.sol";
import { Math as OpenzeppelinMath } from "./imports/openzeppelin/utils/math/Math.sol";

abstract contract VaultMathEngine is FixedPointEngine {
    uint256 constant private _INITIAL_MINT = 1000 * (10**_NATIVE_PRECISION);

    constructor() 
    FixedPointEngine() 
    {}

    function _amountToMint(uint256 assetsIn, uint256 totalAssets, uint256 totalSupply) internal pure returns (uint256) {
        if (totalAssets == 0 && totalSupply == 0) return _INITIAL_MINT;

        if (totalAssets != 0 && totalSupply == 0) return _INITIAL_MINT;

        if (totalAssets == 0 && totalSupply != 0) revert("VaultMathEngine: totalAssets is zero, cannot calculate amount to mint");

        return OpenzeppelinMath.mulDiv(assetsIn, totalSupply, totalAssets);
    }

    function _amountToSend(uint256 supplyIn, uint256 totalAssets, uint256 totalSupply) internal pure returns (uint256) {
        if (totalAssets == 0 && totalSupply == 0) revert("VaultMathEngine: cannot calculate amount to send because there are no assets in the vault and no supply to claim it");

        if (totalAssets != 0 && totalSupply == 0) revert("VaultMathEngine: cannot calculate amount to send because there are assets in the vault but no supply to claim it");

        if (totalAssets == 0 && totalSupply != 0) revert("VaultMathEngine: cannot calculate amount to send because there are no assets in the vault and the supplier would receive nothing in return");

        return OpenzeppelinMath.mulDiv(supplyIn, totalSupply, totalAssets);
    }
}

interface IOwnableToken is IERC20, IERC20Metadata {
    function owner() external view returns (address);
    function renounceOwnership() external;
    function transferOwnership(address newOwner) external;
    function mint(address account, uint256 amount) external;
    function burn(address account, uint256 amount) external;
}

contract OwnableToken is Ownable, ERC20 {
    constructor(string memory name, string memory symbol, address owner)
    Ownable(owner)
    ERC20(name, symbol)
    {}

    function mint(address account, uint256 amount) public
    onlyOwner() {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public
    onlyOwner() {
        _burn(account, amount);
    }
}

contract OwnableTokenFactory {
    constructor() {}

    function deploy(string memory name, string memory symbol) public returns (address) {
        return address(new OwnableToken(name, symbol, msg.sender));
    }
}

abstract contract VaultEngine is FixedPointEngine {
    IOwnableToken immutable private _TOKEN;

    constructor(address token) {
        _TOKEN = IOwnableToken(token);
        
        if (_TOKEN.decimals() != _NATIVE_PRECISION) {
            revert("VaultEngine: token precision does not match `_NATIVE_PRECISION`");
        }
    }


    function _ownership(uint256 supply) internal view returns (uint256 percentage) {
        return _percentageOf(supply, _totalSupply(), _NATIVE_PRECISION, _NATIVE_PRECISION);
    }

    function _totalSupply() internal view returns (uint256) {
        return _TOKEN.totalSupply();
    }


    function _mint(address account, uint256 amount) internal {
        _TOKEN.mint(account, amount);
    }

    function _burn(address account, uint256 amount) internal {
        _TOKEN.burn(account, amount);
    }
}

abstract contract TokenAdaptorEngine is FixedPointEngine {
    constructor() {}

    function _toNative(address token, uint256 value) internal view returns (uint256) {
        return _toNewDecimals(value, _decimals(token), _NATIVE_PRECISION);
    }

    function _toExotic(address token, uint256 value) internal view returns (uint256) {
        return _toNewDecimals(value, _NATIVE_PRECISION, _decimals(token));
    }


    function _balance(address token) internal view returns (uint256) {
        return _toNative(token, IERC20(token).balanceOf(address(this)));
    }


    function _decimals(address token) internal view returns (uint8) {
        return IERC20Metadata(token).decimals();
    }
}

abstract contract TokenVendorEngine is TokenAdaptorEngine, VaultEngine {
    constructor() {}

    function pullToken(address token, uint256 amount) internal {
        IERC20(token).transferFrom(msg.sender, address(this), _toExotic(token, amount));
    }

    function sendToken(address token, uint256 amount) internal {
        IERC20(token).transfer(msg.sender, _toExotic(token, amount));
    }


    function sendTokenOwnership(address token, uint256 supply) internal {
        sendToken(token, _sliceOf(_balance(token), _ownership(supply), _NATIVE_PRECISION, _NATIVE_PRECISION));
    }
}

function _reverse(address[] memory path) pure returns (address[] memory) {
    address[] memory result = new address[](path.length);
    for (uint256 i = 0; i < path.length; i += 1) {
        result[i] = path[path.length - 1 - i];
    }
    return result;
}

abstract contract OracleEngine is TokenAdaptorEngine {
    enum Side {
        SELL,
        BUY
    }

    enum OracleResultOption {
        BEST,
        REAL
    }

    enum PairLayout {
        IS_MATCH,
        IS_REVERSE_MATCH,
        IS_UNRECOGNIZED
    }

    IUniswapV2Router02 constant internal _QUICKSWAP_ROUTER = IUniswapV2Router02(0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff);
    IUniswapV2Factory constant internal _QUICKSWAP_FACTORY = IUniswapV2Factory(0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32);

    constructor() {}

    /** [ Asset ... Currency ] */
    function _slippage(address[] memory path, uint256 amountIn, Side side) internal view returns (uint256) {
        uint256 bestAmountOut = _amountOut(path, amountIn, side, OracleResultOption.BEST);
        uint256 realAmountOut = _amountOut(path, amountIn, side, OracleResultOption.REAL);

        return _loss(realAmountOut, bestAmountOut, _NATIVE_PRECISION, _NATIVE_PRECISION);
    }

    /** [ Asset ... Currency ] */
    function _amountOut(address[] memory path, uint256 amountIn, Side side, OracleResultOption option) internal view returns (uint256) {
        if (amountIn == 0) {
            /** May need to check if the amount is actually too low later on. */
            return 0;
        }
        address token0 = path[0];
        address token1 = path[path.length - 1];

        if (option == OracleResultOption.BEST) {
            return _mul(amountIn, _quote(token0, token1, side), _NATIVE_PRECISION, _NATIVE_PRECISION);
        }

        if (side == Side.SELL) {
            uint256 amountInConverted = _toExotic(token0, amountIn);
            uint256[] memory amounts = _QUICKSWAP_ROUTER.getAmountsOut(amountInConverted, path);
            uint256 amount = amounts[amounts.length - 1];
            uint256 result = _toNative(token1, amount);
            uint256 bestAmountOut = _amountOut(path, amountIn, side, OracleResultOption.BEST);

            if (result >= bestAmountOut) return bestAmountOut;
            
            return result;
        }

        if (side == Side.BUY) {
            address[] memory reversed = _reverse(path);
            address token0_ = reversed[0];
            address token1_ = reversed[reversed.length - 1];
            uint256 amountInConverted = _toExotic(token0_, amountIn);
            uint256[] memory amounts = _QUICKSWAP_ROUTER.getAmountsOut(amountInConverted, reversed);
            uint256 amount = amounts[amounts.length - 1];
            uint256 result = _toNative(token1_, amount);
            uint256 bestAmountOut = _amountOut(reversed, amountIn, side, OracleResultOption.BEST);

            if (result >= bestAmountOut) return bestAmountOut;

            return result;
        }

        return 0;
    }

    function _quote(address token0, address token1, Side side) internal view returns (uint256) {
        if (_layout(token0, token1) == PairLayout.IS_MATCH) {
            return _quote0(token0, token1, side);
        }

        if (_layout(token0, token1) == PairLayout.IS_REVERSE_MATCH) {
            return _quote1(token0, token1, side);
        }

        revert("OracleEngine: unrecognized layout");
    }
    

    function _quote0(address token0, address token1, Side side) private view returns (uint256) {
        return (
            side == Side.SELL 
                ? _toNewDecimals(_QUICKSWAP_ROUTER.quote(10**_decimals(token0), _reserves(token0, token1)[0], _reserves(token0, token1)[1]), _decimals(token1), _NATIVE_PRECISION) :
            side == Side.BUY 
                ? _toNewDecimals(_QUICKSWAP_ROUTER.quote(10**_decimals(token1), _reserves(token0, token1)[1], _reserves(token0, token1)[0]), _decimals(token0), _NATIVE_PRECISION) :
            0
        );
    }

    function _quote1(address token0, address token1, Side side) private view returns (uint256) {
        return (
            side == Side.SELL
                ? _toNewDecimals(_QUICKSWAP_ROUTER.quote(
                    10**_decimals(token1), 
                    _reserves(token0, token1)[1], 
                    _reserves(token0, token1)[0]), 
                    _decimals(token1), _NATIVE_PRECISION) :
            side == Side.BUY
                ? _toNewDecimals(_QUICKSWAP_ROUTER.quote(
                    10**_decimals(token0), 
                    _reserves(token0, token1)[0], 
                    _reserves(token0, token1)[1]), 
                    _decimals(token0), _NATIVE_PRECISION) :
            0
        );
    }


    function _reserves(address token0, address token1) private view returns (uint256[2] memory result) {
        (
            result[0],
            result[1],
        )
            = _interface(token0, token1).getReserves();

        return result;
    }

    function _layout(address token0, address token1) private view returns (PairLayout) {
        if (token0 == _interface(token0, token1).token0() && token1 == _interface(token0, token1).token1()) return PairLayout.IS_MATCH;

        if (token0 == _interface(token0, token1).token1() && token1 == _interface(token0, token1).token0()) return PairLayout.IS_REVERSE_MATCH;

        return PairLayout.IS_UNRECOGNIZED;
    }

    function _interface(address token0, address token1) private view returns (IUniswapV2Pair) {
        address pair = _QUICKSWAP_FACTORY.getPair(token0, token1);

        if (pair == address(0)) {
            revert("OracleEngine: cannot perform operation because a pair was not found");
        }

        return IUniswapV2Pair(pair);
    }
}

abstract contract MarketEngine is OracleEngine {
    event Sale(address asset, address currency, uint256 amountIn, uint256 amountOut);
    event Purchase(address asset, address currency, uint256 amountIn, uint256 amountOut);

    uint256 constant internal _MAX_SLIPPAGE = 10 * (10**_NATIVE_PRECISION);

    constructor() {}

    /** [ Asset ... Currency ] */
    function _swap(address[] memory path, uint256 amountIn, Side side) internal returns (uint256) {
        if (_slippage(path, amountIn, side) > _MAX_SLIPPAGE) revert("MarketEngine: operation would result is too much slippage");

        address token0 = path[0];
        address token1 = path[path.length - 1];

        if (side == Side.SELL) {
            uint256 balance = _toNative(token0, IERC20(token0).balanceOf(address(this)));

            if (balance < amountIn) {
                revert("MarketEngine: insufficient asset to make sale");
            }

            uint256 amountInConverted = _toExotic(token0, amountIn);
            IERC20(token0).approve(address(_QUICKSWAP_ROUTER), 0);
            IERC20(token0).approve(address(_QUICKSWAP_ROUTER), amountInConverted);

            /** Minimum amount can be zero because slippage is checked before the swap. */
            uint256[] memory amounts = _QUICKSWAP_ROUTER.swapExactTokensForTokens(amountInConverted, 0, path, address(this), block.timestamp);

            uint256 amount = amounts[amounts.length - 1];
            uint256 amountOut = _toNative(token1, amount);

            emit Sale(token0, token1, amountIn, amountOut);
            return amountOut;
        }

        if (side == Side.BUY) {
            uint256 balance = _toNative(token1, IERC20(token1).balanceOf(address(this)));

            if (balance < amountIn) {
                revert("MarketEngine: insufficient currency to make purchase");
            }

            uint256 amountInConverted = _toExotic(token1, amountIn);
            IERC20(token1).approve(address(_QUICKSWAP_ROUTER), 0);
            IERC20(token1).approve(address(_QUICKSWAP_ROUTER), amountInConverted);

            /** Minimum amount can be zero because slippage is checked before the swap */
            uint256[] memory amounts = _QUICKSWAP_ROUTER.swapExactTokensForTokens(amountInConverted, 0, _reverse(path), address(this), block.timestamp);
            
            uint256 amount = amounts[amounts.length - 1];
            uint256 amountOut = _toNative(token0, amount);

            emit Purchase(token0, token1, amountIn, amountOut);
            return amountOut;
        }

        return 0;
    }
}

abstract contract PairSlotsEngine is OracleEngine {
    uint8 constant internal _SLOT_COUNT = 9;

    struct Pair {
        bool isBound;
        address[] path;
        address addr;
        uint256 targetAllocation;
    }

    mapping(uint8 => Pair) internal _pairs;

    constructor() {}

    /** [ Asset ... Currency ] */
    function _bind(uint8 slotId, address[] memory path, uint256 targetAllocation) internal returns (bool) {
        _checkForDuplicateAsset(path);
        _checkQuote(path);
        _toggleBound(_pairs[slotId]);
        _assignPairAddress(_pairs[slotId], _pair(path));
        _assignPath(_pairs[slotId], path);
        _assignTargetAllocation(_pairs[slotId], targetAllocation);
        return true;
    }

    function _checkPairAddress(address pair) private pure {
        if (pair == address(0)) {
            revert("PairSlotsEngine: cannot bind pair to slot because pair address could not be found");
        }
    }

    function _checkQuote(address[] memory path) private view {
        address token0 = path[0];
        address token1 = path[path.length - 1];
        uint256 quote0 = _quote(token0, token1, Side.SELL);
        uint256 quote1 = _quote(token0, token1, Side.BUY);
        if (quote0 == 0 || quote1 == 0) {
            revert ("PairSlotsEngine: cannot bind pair to slot because pair returns zero quote");
        }
    }

    function _checkForDuplicateAsset(address[] memory path) private view {
        for (uint8 i = 0; i < _SLOT_COUNT; i += 1) {
            if (_pairs[i].path.length > 0) {
                if (_pairs[i].path[0] == path[0]) {
                    revert("PairSlotsEngine: asset already bound");
                }
            }
        }
    }

    function _pair(address[] memory path) private view returns (address) {
        address token0 = path[0];
        address token1 = path[path.length - 1];
        return _QUICKSWAP_FACTORY.getPair(token0, token1);
    }

    function _assignPath(Pair storage pair, address[] memory path) private {
        for (uint256 i = 0; i < path.length; i += 1) {
            pair.path.push(path[i]);
        }
    }

    function _assignPairAddress(Pair storage pair, address pairAddr) private {
        _checkPairAddress(pairAddr);
        pair.addr = pairAddr;
    }

    function _assignTargetAllocation(Pair storage pair, uint256 targetAllocation) private {
        pair.targetAllocation = targetAllocation;
    }

    function _toggleBound(Pair storage pair) private {
        pair.isBound = true;
    }
}

struct PairSlotPayload {
    address[] path;
    uint256 targetAllocation;
}

contract Vault is 
    Ownable, 
    MarketEngine, 
    VaultEngine, 
    TokenVendorEngine, 
    VaultMathEngine, 
    PairSlotsEngine {
    address constant _CURRENCY = 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359;

    constructor(address ownableToken, PairSlotPayload[] memory pairs)
    Ownable(msg.sender)
    VaultEngine(ownableToken) {
        _checkTotalAllocation(pairs);
        _bindPairs(pairs);
    }

    function previewMint(uint256 assetsIn) public view returns (uint256) {
        return _amountToMint(assetsIn, totalRealAssets(), _totalSupply());
    }

    function previewBurn(uint256 supplyIn) public view returns (uint256) {
        return _amountToSend(supplyIn, totalRealAssets(), _totalSupply());
    }

    function slippage(uint8 slotId, uint256 amountIn, Side side) public view returns (uint256) {
        return _slippage(_pairs[slotId].path, amountIn, side);
    }

    function totalBestAssets() public view returns (uint256) {
        uint256 result = _balance(_CURRENCY);
        for (uint8 i = 0; i < _SLOT_COUNT; i += 1) {
            address[] memory path = _pairs[i].path;
            if (path.length >= 2) {
                address token0 = path[0];
                address token1 = path[path.length - 1];
                /** If balance is too low this may cause issues for the Uniswap oracle. */
                uint256 balance = _balance(token0);
                uint256 totalValue = _amountOut(path, balance, Side.SELL, OracleResultOption.BEST);
                result += totalValue;
            }
        }
        return result;
    }

    function totalRealAssets() public view returns (uint256) {
        uint256 result = _balance(_CURRENCY);
        for (uint8 i = 0; i < _SLOT_COUNT; i += 1) {
            address[] memory path = _pairs[i].path;
            if (path.length >= 2) {
                address token0 = path[0];
                address token1 = path[path.length - 1];
                /** If balance is too low this may cause issues for the Uniswap oracle. */
                uint256 balance = _balance(token0);
                uint256 totalValue = _amountOut(path, balance, Side.SELL, OracleResultOption.REAL);
                result += totalValue;
            }
        }
        return result;
    }

    function currentAllocation(uint8 slotId, ) public view returns (uint256) {
        address[] storage path = _pairs[slotId].path;
        address token0 = path[0];
        address token1 = path[path.length - 1];
        
    }

    function mint(uint256 assetsIn) public returns (bool) {
        uint256 amountToMint = previewMint(assetsIn);
        uint256 assetsInConverted = _toExotic(_CURRENCY, assetsIn);
        IERC20(_CURRENCY).transferFrom(msg.sender, address(this), assetsInConverted);
        _mint(msg.sender, amountToMint);
        return true;
    }

    function burn(uint256 supplyIn) public returns (bool) {
        _burn(msg.sender, supplyIn);
        for (uint8 i = 0; i < _SLOT_COUNT; i += 1) {
            sendTokenOwnership(_pairs[i].path[0], supplyIn);
        }
        return true;
    }

    function rebalance() public {
        _rebalance();
    }

    function _rebalance() internal returns (bool) {
        if (totalRealAssets() == 0) {
            return false;
        }
        bool[_SLOT_COUNT] memory done;
        for (uint8 i = 0; i < _SLOT_COUNT; i += 1) {
            address[] memory path = _pairs[i].path;
            if (path.length >= 2) {
                uint256 currentAllocation; 
                {
                    address token0 = path[0];
                    address token1 = path[path.length - 1];
                    /** If balance is too low this may cause issues for the Uniswap oracle. */
                    uint256 balance = _balance(token0);
                    uint256 realAssetValue = _amountOut(path, balance, Side.SELL, OracleResultOption.REAL);
                    currentAllocation = _div(realAssetValue, totalRealAssets(), _NATIVE_PRECISION, _NATIVE_PRECISION);
                    currentAllocation = _mul(currentAllocation, _ONE_HUNDRED_PERCENT, _NATIVE_PRECISION, _NATIVE_PRECISION);
                }
                uint256 targetAllocation = _pairs[i].targetAllocation;
                if (currentAllocation > targetAllocation) {
                    uint256 targetBalance; 
                    {
                        targetBalance = _div(totalRealAssets(), _ONE_HUNDRED_PERCENT, _NATIVE_PRECISION, _NATIVE_PRECISION);
                        targetBalance = _mul(targetBalance, targetAllocation, _NATIVE_PRECISION, _NATIVE_PRECISION);
                    }
                    uint256 actualBalance; 
                    {
                        actualBalance = _div(totalRealAssets(), _ONE_HUNDRED_PERCENT, _NATIVE_PRECISION, _NATIVE_PRECISION);
                        actualBalance = _mul(actualBalance, currentAllocation, _NATIVE_PRECISION, _NATIVE_PRECISION);
                    }
                    uint256 amountToSell = _sub(actualBalance, targetBalance, _NATIVE_PRECISION, _NATIVE_PRECISION);
                    if (_slippage(path, amountToSell, Side.SELL) <= _MAX_SLIPPAGE && _balance(path[0]) >= amountToSell) {
                        _swap(path, amountToSell, Side.SELL);
                    }
                    done[i] = true;
                }
            }
        }
        /** Same but for purchases. */
        for (uint8 i = 0; i < _SLOT_COUNT; i += 1) {
            address[] memory path = _pairs[i].path;
            if (path.length >= 2 && !done[i]) {
                address token0 = path[0];
                address token1 = path[path.length - 1];
                uint256 currentAllocation; 
                {
                    /** If balance is too low this may cause issues for the Uniswap oracle. */
                    uint256 balance = _balance(token0);
                    uint256 realAssetValue = _amountOut(path, balance, Side.SELL, OracleResultOption.REAL);
                    currentAllocation = _div(realAssetValue, totalRealAssets(), _NATIVE_PRECISION, _NATIVE_PRECISION);
                    currentAllocation = _mul(currentAllocation, _ONE_HUNDRED_PERCENT, _NATIVE_PRECISION, _NATIVE_PRECISION);
                }
                uint256 targetAllocation = _pairs[i].targetAllocation;
                if (currentAllocation < targetAllocation) {
                    uint256 targetBalance; 
                    {
                        targetBalance = _div(totalRealAssets(), _ONE_HUNDRED_PERCENT, _NATIVE_PRECISION, _NATIVE_PRECISION);
                        targetBalance = _mul(targetBalance, targetAllocation, _NATIVE_PRECISION, _NATIVE_PRECISION);
                    }
                    uint256 actualBalance; 
                    {
                        actualBalance = _div(totalRealAssets(), _ONE_HUNDRED_PERCENT, _NATIVE_PRECISION, _NATIVE_PRECISION);
                        actualBalance = _mul(actualBalance, currentAllocation, _NATIVE_PRECISION, _NATIVE_PRECISION);
                    }
                    uint256 amountToPurchase = _sub(targetBalance, actualBalance, _NATIVE_PRECISION, _NATIVE_PRECISION);
                    uint256 costToPurchase = _mul(amountToPurchase, _quote(token0, token1, Side.SELL), _NATIVE_PRECISION, _NATIVE_PRECISION);
                    /** slipage is 100 */
                    if (_slippage(path, costToPurchase, Side.BUY) <= _MAX_SLIPPAGE && _balance(_CURRENCY) >= costToPurchase) {
                        _swap(path, costToPurchase, Side.BUY);
                    }
                    done[i] = true;
                }
            }
        }
        return true;
    }

    function _checkTotalAllocation(PairSlotPayload[] memory pairs) private pure {
        uint256 totalAllocation = 0;
        for (uint256 i = 0; i < pairs.length; i += 1) {
            totalAllocation += pairs[i].targetAllocation;
        }
        if (totalAllocation != _ONE_HUNDRED_PERCENT) {
            revert("Vault: allocations are not equal to 100%");
        }
    }

    function _bindPairs(PairSlotPayload[] memory pairs) private {
        for (uint8 i = 0; i < pairs.length; i += 1) {
            _bind(i, pairs[i].path, pairs[i].targetAllocation);
        }
    }
}