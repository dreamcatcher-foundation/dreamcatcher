
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\Api3Adaptor.sol
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
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\Api3Adaptor.sol
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
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\Api3Adaptor.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;
////import "contracts/polygon/deps/openzeppelin/access/Ownable.sol";
////import "contracts/polygon/libraries/Finance.sol";

interface IDapiProxy {
    function api3ServerV1() external view returns (address);
    function dapiNameHash() external view returns (bytes32);
    function read() external view returns (int224, uint32);
}

interface IApi3Adaptor {
    using Finance for uint;

    event SymbolAChanged(string oldSymbol, string newSymbol);
    event SymbolBChanged(string oldSymbol, string newSymbol);
    event Api3ServerChanged(address oldAddress, address newAddress);
    event SetUp(string symbolA, string symbolB, address api3Server);

    function symbolA() external view returns (string memory);
    function symbolB() external view returns (string memory);
    function decimals() external view returns (uint8);

    function api3Server() external view returns (address);

    function ready() external view returns (bool);

    function price() external view returns (uint);
    function timestamp() external view returns (uint);

    function time() external view returns (uint);

    function isWithinTheLastHour() external view returns (bool);
    function isWithinTheLastDay() external view returns (bool);
    function isWithinTheLastWeek() external view returns (bool);
    function isWithinTheLastMonth() external view returns (bool);

    function start() external;
    function setSymbolA(string memory newSymbol) external;
    function setSymbolB(string memory newSymbol) external;
    function setDecimals(uint8 newDecimals) external;
    function setApi3Server(address newAddress) external;

    function owner() external view returns (address);

    function renounceOwnership() external;
    function transferOwnership(address newOwner) external;
}

contract Api3Adaptor is Ownable {


    string private _symbolA;
    string private _symbolB;
    uint8 private _decimals;
    address private _api3Server;
    bool private _ready;

    event SymbolAChanged(string oldSymbol, string newSymbol);
    event SymbolBChanged(string oldSymbol, string newSymbol);
    event Api3ServerChanged(address oldAddress, address newAddress);
    event DecimalsChanged(uint oldDecimals, uint newDecimals);
    event SetUp(string symbolA, string symbolB, address api3Server);

    constructor() Ownable(msg.sender) {}

    function symbolA() public view virtual returns (string memory) {
        require(ready(), "!ready");
        return _symbolA;
    }

    function symbolB() public view virtual returns (string memory) {
        require(ready(), "!ready");
        return _symbolB;
    }

    /// divide by this number
    function decimals() public view virtual returns (uint8) {
        require(ready(), "!ready");
        return _decimals;
    }

    ///

    function api3Server() public view virtual returns (address) {
        require(ready(), "!ready");
        return _api3Server;
    }

    ///

    function ready() public view virtual returns (bool) {
        return _ready;
    }

    ///

    /// price as 10**18 value
    function price() public view virtual returns (uint) {
        require(ready(), "!ready");
        (int224 price,) = IDapiProxy(api3Server()).read();
        /// converting whatever non standard into 18 decimals value
        return uint(uint224(price)).computeAsStandardValue(decimals());
    }

    /// get timestamp of the when the last price was pushed
    function timestamp() public view virtual returns (uint) {
        require(ready(), "!ready");
        (, uint32 timestamp) = IDapiProxy(api3Server()).read();
        return uint(timestamp);
    }

    ///

    function time() public view virtual returns (uint) {
        return block.timestamp;
    }

    ///

    function isWithinTheLastHour() public view virtual returns (bool) {
        require(ready(), "!ready");
        if (timestamp() >= time() - 3600 seconds) {
            return true;
        }
        return false;
    }

    function isWithinTheLastDay() public view virtual returns (bool) {
        require(ready(), "!ready");
        if (timestamp() >= time() - 86400 seconds) {
            return true;
        }
        return false;
    }

    function isWithinTheLastWeek() public view virtual returns (bool) {
        require(ready(), "!ready");
        if (timestamp() >= time() - 604800 seconds) {
            return true;
        }
        return false;
    }

    function isWithinTheLastMonth() public view virtual returns (bool) {
        require(ready(), "!ready");
        if (timestamp() >= time() - 2419200 seconds) {
            return true;
        }
        return false;
    }

    ///

    function start() onlyOwner public virtual {
        require(!ready(), "ready");
        _ready = true;
        emit SetUp(symbolA(), symbolB(), api3Server());
    }

    function setSymbolA(string memory newSymbol) onlyOwner public virtual {
        require(!ready(), "ready");
        string memory oldSymbol = symbolA();
        _symbolA = newSymbol;
        emit SymbolAChanged(oldSymbol, newSymbol);
    }

    function setSymbolB(string memory newSymbol) onlyOwner public virtual {
        require(!ready(), "ready");
        string memory oldSymbol = symbolB();
        _symbolB = newSymbol;
        emit SymbolBChanged(oldSymbol, newSymbol);
    }

    function setDecimals(uint8 newDecimals) onlyOwner public virtual {
        require(!ready(), "ready");
        uint8 oldDecimals = decimals();
        _decimals = newDecimals;
        emit DecimalsChanged(oldDecimals, newDecimals);
    }

    function setApi3Server(address newAddress) onlyOwner public virtual {
        require(!ready(), "ready");
        address oldAddress = api3Server();
        _api3Server = newAddress;
        emit Api3ServerChanged(oldAddress, newAddress);
    }
}
