// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IToken} from "./asset/token/IToken.sol";
import {IUniswapV2Router02} from "./import/uniswap/v2/interfaces/IUniswapV2Router02.sol";
import {IUniswapV2Factory} from "./import/uniswap/v2/interfaces/IUniswapV2Factory.sol";
import {IUniswapV2Pair} from "./import/uniswap/v2/interfaces/IUniswapV2Pair.sol";


struct Asset {
    address token;
    address currency;
    address[] tokenToCurrencyPath;
    address[] currencyToTokenPath;
    uint256 targetAllocation;
}

struct ComputedAsset {
    address token;
    address currency;
    address[] tokenToCurrencyPath;
    address[] currencyToTokenPath;
    uint256 targetAllocation;
    uint256 actualAllocation;
    uint256 targetNetAssetValue;
    uint256 actualNetAssetValue;
    uint256 surplusBalance;
    uint256 deficitBalance;
    uint256 surplusNetAssetValue;
    uint256 deficitNetAssetValue;
}

struct Exchange {
    address router;
    address factory;
}

struct Pair {
    address pair;
    address token0;
    address token1;
    uint256 reserve0;
    uint256 reserve1;
}

struct Quote {
    uint256 real;
    uint256 best;
    uint256 slippage;
}

enum Side {
    TokenToCurrencyPath,
    CurrencyToTokenPath
}

abstract contract FixedPointEngine {

    function _slc(uint256 x, uint256 percentage) internal pure returns (uint256) {
        return _mul(_div(x, 100e18), percentage);
    }

    function _lss(uint256 x, uint256 y) internal pure returns (uint256 percentage) {
        return 100e18 - _yld(x, y);
    }

    function _yld(uint256 x, uint256 y) internal pure returns (uint256 percentage) {
        return 
            x == 0 ? 0 :
            x >= y ? 100e18 : 
            _pct(x, y);
    }

    function _pct(uint256 x, uint256 y) internal pure returns (uint256 percentage) {
        return _mul(_div(x, y), 100e18);
    }

    function _add(uint256 x, uint256 y) internal pure returns (uint256) {
        unchecked {
            uint256 z = x + y;
            if (z < x) revert ("unsigned-integer-overflow");
            return z;
        }
    }

    function _sub(uint256 x, uint256 y) internal pure returns (uint256) {
        unchecked {
            uint256 z = x - y;
            if (y > x) revert ("unsigned-integer-underflow");
            return z;
        }
    }

    function _mul(uint256 x, uint256 y) internal pure returns (uint256) {
        return _muldiv(x, y, 1e18);
    }

    function _div(uint256 x, uint256 y) internal pure returns (uint256) {
        return _muldiv(x, 1e18, y);
    }

    function _toNewPrecision(uint256 x, uint8 decimals0, uint8 decimals1) internal pure returns (uint256) {
        return x == 0 || decimals0 == decimals1 ? x : _muldiv(x, 10**decimals1, 10**decimals0);
    }

    function _muldiv(uint256 x, uint256 y, uint256 z) internal pure returns (uint256) {
        unchecked {
            uint256 prod0;
            uint256 prod1;
            assembly {
                let mm := mulmod(x, y, not(0))
                prod0 := mul(x, y)
                prod1 := sub(sub(mm, prod0), lt(mm, prod0))
            }
            if (prod1 == 0) {
                return prod0 / z;
            }
            if (z <= prod1) revert ("unsigned-integer-muldiv-overflow");
            uint256 remainder;
            assembly {
                remainder := mulmod(x, y, z)
                prod1 := sub(prod1, gt(remainder, prod0))
                prod0 := sub(prod0, remainder)
            }
            uint256 twos = z & (~z + 1);
            assembly {
                z := div(z, twos)
                prod0 := div(prod0, twos)
                twos := add(div(sub(0, twos), twos), 1)
            }
            prod0 |= prod1 * twos;
            uint256 inverse = (3 * z) ^ 2;
            inverse *= 2 - z * inverse;
            inverse *= 2 - z * inverse;
            inverse *= 2 - z * inverse;
            inverse *= 2 - z * inverse;
            inverse *= 2 - z * inverse;
            inverse *= 2 - z * inverse;
            return prod0 * inverse;
        }
    }
}

struct VirtualSafeSimulationInput {
    uint amount;
    uint assets;
    uint supply;
}

abstract contract VirtualSafeSimulator is FixedPointEngine {

    function _simulateMint(VirtualSafeSimulationInput memory state) internal pure returns (uint256) {
        return
            state.amount == 0 ? 0 :

            state.assets == 0 && state.supply == 0 ? _initialMint() :
            state.assets != 0 && state.supply == 0 ? _initialMint() :
            state.assets == 0 && state.supply != 0 ? 0 :

            _div(_mul(state.amount, state.supply), state.assets);
    }

    function _simulateBurn(VirtualSafeSimulationInput memory state) internal pure returns (uint256) {
        return
            state.amount == 0 ? 0 :

            state.assets == 0 && state.supply == 0 ? 0 :
            state.assets != 0 && state.supply == 0 ? 0 :
            state.assets == 0 && state.supply != 0 ? 0 :

            _div(_mul(state.amount, state.assets), state.supply);
    }

    function _initialMint() private pure returns (uint256) {
        return 1000000e18;
    }
}








struct InternalQuoteInput {
    Exchange exchange;
    Asset asset;
    Side side;
    uint256 amount;
}

abstract contract UniswapEngine is FixedPointEngine {



    struct ReserveFetchRequest {
        Exchange exchange;
        address token0;
        address token1;
    }

    struct Reserves {
        uint256 x;
        uint256 y;
    }

    function _reserves(ReserveFetchRequest memory request) private view returns (Reserves memory) {
        address factory = request.exchange.factory;
        address token0 = request.token0;
        address token1 = request.token1;
        IUniswapV2Factory factoryI = IUniswapV2Factory(factory);
        IToken token0I = IToken(token0);
        IToken token1I = IToken(token1);
        address pair = factoryI.getPair(token0, token1);
        IUniswapV2Pair pairI = IUniswapV2Pair(pair);
        address pairToken0 = pairI.token0();
        address pairToken1 = pairI.token1();
        (uint256 reserve0, uint256 reserve1,) = pairI.getReserves();
        bool sorted =
            token0 == pairToken0 &&
            token1 == pairToken1;
        if (!sorted) (reserve0, reserve1) = _sort(reserve0, reserve1);
        return Reserves({x: reserve0, y: reserve1});
    }

    function _sort(uint256 x, uint256 y) private pure returns (uint256, uint256) {
        return (y, x);
    }
}



interface IFixedPointEngine {}
interface IVendorEngine {}
interface IUV2Engine {}
interface IAccessEngine {}
interface IAssetEngine {}
interface IConfigHandler {}

contract V1 {
    IFixedPointEngine private _fixedPointEngineI;
    IVendorEngine private _vendorEngineI;
    IUV2Engine private _uniswapV2EngineI;
    IAccessEngine private _accessEngineI;
    IAssetEngine private _assetEngineI;
    IToken private _vTokenI;

    constructor(
        IFixedPointEngine fixedPointEngineI, 
        IVendorEngine vendorEngineI, 
        IUV2Engine uniswapV2EngineI,
        IAccessEngine accessEngineI,
        IAssetEngine assetEngineI) {
        _fixedPointEngineI = fixedPointEngineI;
        _vendorEngineI = vendorEngineI;
        _uniswapV2EngineI = uniswapV2EngineI;
        _accessEngineI = accessEngineI;
        _assetEngineI = assetEngineI;
    }

    function transferOwnership() public {
        _asI.onlyOwner();
        _asI.transferOwnership();
        return;
    }

    function buy(string memory symbol, uint256 amount) public {
        IAsset assetI = _atI.asset(symbol);
        (uint256 amountOut, uint256 slippage) = _uv2.buy(assetI, amount);
        _metricsI.increaseSlippage(slippage);
        _metricsI.checkSlippageAllowance();
    }

    function blacklistAccount(address account) public {
        _accessEngineI.onlyOwner();
        _configI.set(account);
    }

    function changeAssetAllocation(uint256 percentage) public {
        _atI.changeAssetAllocation(percentage);
    }

    function previewMint() internal {
        uint256 assets = _uv2eI.totalAssets().best;
        uint256 supply = _vtI.totalSupply();
        return _veI.previewMint();
    }

    function rebalance() public {
        _t.secondsLeft();
        _fm.tryDeficit();
        _fm.trySurplus();

    }
}



contract AssetHolder {
    Asset[] private _assets;

    function _asset(uint i) internal view returns (Asset memory) {
        return _assets[i];
    }

    function _asset(string memory symbol) internal view returns (bool, Asset memory) {
        for (uint i = 0; i < _asset.length; i++) {
            Asset memory asset = _asset(i);
            IToken tokenI = IToken(asset.token);
            bytes32 symbol0 = keccak256(abi.encodePacked(tokenI.symbol()));
            bytes32 symbol1 = keccak256(abi.encodePacked(symbol));
            if (symbol0 == symbol1) return (true, asset);
        }
        Asset memory asset;
        return (false, asset);
    }
}



struct LiteTokenSl {
    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowances;
    uint256 totalSupply;
    string symbol;
}

contract LiteTokenLibrary {

    function simulateTransfer(LiteTokenSl storage) external pure returns (LiteTokenSl storage) {

    }
}


library LiteTokenLibrarys {
    struct Token {
        mapping(address => uint) balances;
        mapping(address => mapping(address => uint)) allowances;
        uint256 totalSupply;
        string symbol;
    }

    function mint(Token storage token) public {
        
    }
}

contract LiteToken {
    event Transfer(address indexed from, address indexed to, uint256 amount);
    error ZeroAddress();
    error InsufficientBalance();
    error InsufficientAllowance();

    mapping(address => uint) private _balances;
    mapping(address => mapping(address => uint)) private _allowances;
    uint256 private _totalSupply;
    string private _symbol;

    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual returns (uint8) {
        return 18;
    }

    function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }

    function allowance(address owner, address spender) public view virtual returns (uint256) {
        return _allowances[owner][spender];
    }

    function transfer(address to, uint256 amount) public virtual returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public virtual returns (bool) {

    }

    function _mint(address account, uint256 amount) internal virtual {
        _onlyNonZeroAddress(account);
        _increaseTotalSupply(amount);
        _increaseBalance(account, amount);
        _emitTransfer(address(0), account, amount);
        return;
    }

    function _burn(address account, uint256 amount) internal virtual {
        _onlyNonZeroAddress(account);
        _onlySufficientBalance(account, amount);
        _decreaseBalance(account, amount);
        _decreaseTotalSupply(amount);
        _emitTransfer(account, address(0), amount);
        return;
    }

    function _transfer(address from, address to, uint256 amount, bool unsafe) private virtual returns (bool) {
        _onlyNonZeroAddress(from);
        _onlyNonZeroAddress(to);
        _onlySufficientBalance(from, amount);
        _decreaseBalance(from, amount);
        _increaseBalance(to, amount);
        _emitTransfer(from, to, amount);
        return;
    }

    function _approve(address owner, address spender, uint256 amount) private virtual {
        _onlyNonZeroAddress(owner);
        _onlyNonZeroAddress(spender);
        _setAllowance(owner, spender, amount);
        _emitApproval(owner, spender, amount);
        return;
    }

    function _spendAllowance(address owner, address spender, uint256 amount) private virtual {
        if (allowance(owner, spender) == type(uint256).max) return;
        _onlySufficientAllowance(owner, spender, amount);
        _approve(owner, spender, allowance(owner, spender) - amount);
        return;
    }

    function _onlyNonZeroAddress(address account) private pure {
        if (account == address(0)) revert ZeroAddress();
        return;
    }

    function _onlySufficientBalance(address account, uint256 amount) private pure {
        if (_balances[account] < amount) revert InsufficientBalance();
        return;
    }

    function _onlySufficientAllowance(address owner, address spender, uint256 amount) private pure {
        if (allowance(owner, spender) < amount) revert InsufficientAllowance();
        return;
    }

    function _emitTransfer(address from, address to, uint256 amount) private {
        emit Transfer(from, to, amount);
        return;
    }

    function _emitApproval(address owner, address spender, uint256 amount) private {
        emit Approval(owner, spender, amount);
        return;
    }

    function _setAllowance(address owner, address spender, uint256 amount) private {
        _allowances[owner][spender] = amount;
        return;
    }

    function _increaseTotalSupply(uint256 amount) private {
        _totalSupply += amount;
        return;
    }

    function _decreaseTotalSupply(uint256 amount) private {
        _totalSupply -= amount;
        return;
    }

    function _increaseBalance(address account, uint256 amount) private {
        unchecked {
            _balances[account] += amount;
        }
        return;
    }

    function _decreaseBalance(address account, uint256 amount) private {
        unchecked {
            _balances[account] -= amount;
        }
        return;
    }
}



contract TokenBalanceHandler {
    mapping(address => uint256) private _balances;

}