
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\Broker.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)

pragma solidity ^0.8.19;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\Broker.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;
////import "contracts/polygon/deps/openzeppelin/token/ERC20/ERC20.sol";
////import "contracts/polygon/deps/openzeppelin/token/ERC20/extensions/ERC20Burnable.sol";
////import "contracts/polygon/deps/openzeppelin/token/ERC20/extensions/ERC20Snapshot.sol";
////import "contracts/polygon/deps/openzeppelin/token/ERC20/extensions/ERC20Permit.sol";
////import "contracts/polygon/deps/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
////import "contracts/polygon/deps/openzeppelin/token/ERC20/extensions/IERC20Permit.sol";
////import 'contracts/polygon/deps/openzeppelin/token/ERC20/IERC20.sol';

interface IToken is IERC20, IERC20Metadata, IERC20Permit {
    function balanceOfAt(address account, uint snapshotId) external returns (uint);
    function totalSupplyAt(uint snapshotId) external returns (uint);
    
    function burn(uint amount) external;
    function burnFrom(address account, uint amount) external;

    function snapshot() external returns (uint);
}

contract Token is ERC20, ERC20Burnable, ERC20Snapshot, ERC20Permit {
    constructor(string memory name, string memory symbol, uint mint_) ERC20(name, symbol) ERC20Permit(name) {
        _mint(msg.sender, mint_ * (10**18));
    }

    function snapshot() external virtual returns (uint) {
        return _snapshot();
    }

    function _mint(address to, uint amount) internal virtual override {
        super._mint(to, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint amount) internal override(ERC20, ERC20Snapshot) {
        super._beforeTokenTransfer(from, to, amount);
    }   
}



/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\Broker.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (access/Ownable.sol)

pragma solidity ^0.8.19;

////import "../utils/Context.sol";

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\Broker.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;
////import "contracts/polygon/deps/openzeppelin/access/Ownable.sol";
////import "contracts/polygon/diamonds/facets/OracleReader.sol";
////import "contracts/polygon/solidstate/ERC20/Token.sol";
////import "contracts/polygon/libraries/Finance.sol";

contract Broker is Ownable {
    using Finance for uint;

    address private _oracle;
    uint private _collateral;
    uint private _deposit;
    uint private _withdraw;
    uint private _slippageThreshold;
    uint private _startTimestamp;
    uint private _duration;
    bool private _success;
    bool private _ready;

    constructor() Ownable(msg.sender) {}

    function oracle() public view virtual returns (address) {
        return _oracle;
    }

    ///

    function adaptor(address token) public view virtual returns (address) {
        return IOracleReader(oracle()).adaptor(token);
    }

    function hasAdaptor(address token) public view virtual returns (bool) {
        return IOracleReader(oracle()).hasAdaptor(token);
    }

    ///

    function symbolA(address token) public view virtual returns (string memory) {
        return IOracleReader(oracle()).symbolA(token);
    }

    function symbolB(address token) public view virtual returns (string memory) {
        return IOracleReader(oracle()).symbolB(token);
    }

    /// divide the price by this to get the human readable price
    function decimals(address token) public view virtual returns (uint8) {
        return IOracleReader(oracle()).decimals(token);
    }

    ///

    function price(address token) public view virtual returns (uint) {
        return IOracleReader(oracle()).price(token);
    }

    function timestamp(address token) public view virtual returns (uint) {
        return IOracleReader(oracle()).timestamp(token);
    }

    ///

    function isWithinTheLastHour(address token) public view virtual returns (bool) {
        return IOracleReader(oracle()).isWithinTheLastHour(token);
    }

    function isWithinTheLastDay(address token) public view virtual returns (bool) {
        return IOracleReader(oracle()).isWithinTheLastDay(token);
    }

    function isWithinTheLastWeek(address token) public view virtual returns (bool) {
        return IOracleReader(oracle()).isWithinTheLastWeek(token);
    }

    function isWithinTheLastMonth(address token) public view virtual returns (bool) {
        return IOracleReader(oracle()).isWithinTheLastMonth(token);
    }

    ///

    function deposit() public view virtual returns (uint) {
        return _deposit;
    }

    function withdraw() public view virtual returns (uint) {
        return _withdraw;
    }

    ///

    function slippageThreshold() public view virtual returns (uint) {
        return _slippageThreshold;
    }

    function slippage() public view virtual returns (uint) {
        return withdraw() - deposit();
    }

    ///

    function startTimestamp() public view virtual returns (uint) {
        return _startTimestamp;
    }

    function duration() public view virtual returns (uint) {
        return _duration;
    }

    function time() public view virtual returns (uint) {
        return block.timestamp;
    }

    function begun() public view virtual returns (bool) {
        return time() >= startTimestamp() && ready();
    }

    function ended() public view virtual returns (bool) {
        return time() >= startTimestamp() + duration() && ready();
    }

    function isInSession() public view virtual returns (bool) {
        return begun() && !ended() && ready();
    }

    ///

    function success() public view virtual returns (bool) {
        return _success;
    }

    ///

    function ready() public view virtual returns (bool) {
        return _ready;
    }

    ///

    function conditionsHaveBeenMet() public view virtual returns (bool) {
        if (!success()) {
            return isInSession() && slippage() <= slippageThreshold();
        }
        return success();
    }

    ///

    function deposit(address tokenIn, uint amountIn) public virtual {
        IToken token = IToken(tokenIn);
        require(hasAdaptor(tokenIn), "!hasAdaptor");
        require(!_priceIsZero(tokenIn), "_priceIsZero");
        token.transferFrom(msg.sender, address(this), amountIn);
        amountIn = amountIn.computeAsNativeValue(token.decimals());
        uint price_ = price(tokenIn);
        price_ = price_.computeAsNativeValue(decimals(tokenIn));
        _deposit += price_ * amountIn;
    }

    ///

    function _priceIsZero(address tokenIn) public virtual {
        uint price_ = price(tokenIn);
        uint price_ = price_.computeAsNativeValue(decimals(tokenIn));
        return price_ == 0;
    }
}
