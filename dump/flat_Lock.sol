
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\Lock.sol
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
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\Lock.sol
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
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\Lock.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;
////import "contracts/polygon/deps/openzeppelin/access/Ownable.sol";

interface ILock {
    event SetUp(uint startTimestamp, uint duration);
    event DurationChanged(uint oldDuration, uint newDuration);
    event Passed();
    event OwnershipTransferred(address indexed oldThreshold, uint newThreshold);

    function startTimestamp() external view returns (uint);
    function duration() external view returns (uint);
    function time() external view returns (uint);
    function begun() external view returns (bool);
    function ended() external view returns (bool);
    function isInSession() external view returns (bool);

    function success() external view returns (bool);

    function ready() external view returns (bool);

    function conditionsHaveBeenMet() external view returns (bool);

    function start() external; 
    function setDuration(uint newDuration) external;

    function check() external;

    function owner() external view returns (address);

    function renounceOwnership() external;
    function transferOwnership(address newOwner) external;
}

contract Lock is Ownable {
    uint private _startTimestamp;
    uint private _duration;
    bool private _success;
    bool private _ready;
    
    event SetUp(uint startTimestamp, uint duration);
    event DurationChanged(uint oldDuration, uint newDuration);
    event Passed();

    constructor() Ownable(msg.sender) {}

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
            return time() >= startTimestamp() + duration();
        }
        return success();
    }

    ///

    function start() onlyOwner public virtual {
        require(!begun(), "begun");
        _ready = true;
        _startTimestamp = time();
        emit SetUp(startTimestamp(), duration());
    }

    function setDuration(uint newDuration) onlyOwner public virtual {
        require(!begun(), "begun");
        uint oldDuration = duration();
        _duration = newDuration;
        emit DurationChanged(oldDuration, newDuration);
    }

    ///

    function check() public virtual {
        require(begun(), "!begun");
        if (conditionsHaveBeenMet() && ended() && !success()) {
            _success = true;
            emit Passed();
        }
    }
}
