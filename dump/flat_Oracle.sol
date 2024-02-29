
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\Oracle.sol
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
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\Oracle.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (utils/structs/EnumerableSet.sol)
// This file was procedurally generated from scripts/generate/templates/EnumerableSet.js.

pragma solidity ^0.8.19;

/**
 * @dev Library for managing
 * https://en.wikipedia.org/wiki/Set_(abstract_data_type)[sets] of primitive
 * types.
 *
 * Sets have the following properties:
 *
 * - Elements are added, removed, and checked for existence in constant time
 * (O(1)).
 * - Elements are enumerated in O(n). No guarantees are made on the ordering.
 *
 * ```solidity
 * contract Example {
 *     // Add the library methods
 *     using EnumerableSet for EnumerableSet.AddressSet;
 *
 *     // Declare a set state variable
 *     EnumerableSet.AddressSet private mySet;
 * }
 * ```
 *
 * As of v3.3.0, sets of type `bytes32` (`Bytes32Set`), `address` (`AddressSet`)
 * and `uint256` (`UintSet`) are supported.
 *
 * [WARNING]
 * ====
 * Trying to delete such a structure from storage will likely result in data corruption, rendering the structure
 * unusable.
 * See https://github.com/ethereum/solidity/pull/11843[ethereum/solidity#11843] for more info.
 *
 * In order to clean an EnumerableSet, you can either remove all elements one by one or create a fresh instance using an
 * array of EnumerableSet.
 * ====
 */
library EnumerableSet {
    // To implement this library for multiple types with as little code
    // repetition as possible, we write it in terms of a generic Set type with
    // bytes32 values.
    // The Set implementation uses private functions, and user-facing
    // implementations (such as AddressSet) are just wrappers around the
    // underlying Set.
    // This means that we can only create new EnumerableSets for types that fit
    // in bytes32.

    struct Set {
        // Storage of set values
        bytes32[] _values;
        // Position of the value in the `values` array, plus 1 because index 0
        // means a value is not in the set.
        mapping(bytes32 => uint256) _indexes;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function _add(Set storage set, bytes32 value) private returns (bool) {
        if (!_contains(set, value)) {
            set._values.push(value);
            // The value is stored at length-1, but we add 1 to all indexes
            // and use 0 as a sentinel value
            set._indexes[value] = set._values.length;
            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function _remove(Set storage set, bytes32 value) private returns (bool) {
        // We read and store the value's index to prevent multiple reads from the same storage slot
        uint256 valueIndex = set._indexes[value];

        if (valueIndex != 0) {
            // Equivalent to contains(set, value)
            // To delete an element from the _values array in O(1), we swap the element to delete with the last one in
            // the array, and then remove the last element (sometimes called as 'swap and pop').
            // This modifies the order of the array, as noted in {at}.

            uint256 toDeleteIndex = valueIndex - 1;
            uint256 lastIndex = set._values.length - 1;

            if (lastIndex != toDeleteIndex) {
                bytes32 lastValue = set._values[lastIndex];

                // Move the last value to the index where the value to delete is
                set._values[toDeleteIndex] = lastValue;
                // Update the index for the moved value
                set._indexes[lastValue] = valueIndex; // Replace lastValue's index to valueIndex
            }

            // Delete the slot where the moved value was stored
            set._values.pop();

            // Delete the index for the deleted slot
            delete set._indexes[value];

            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function _contains(Set storage set, bytes32 value) private view returns (bool) {
        return set._indexes[value] != 0;
    }

    /**
     * @dev Returns the number of values on the set. O(1).
     */
    function _length(Set storage set) private view returns (uint256) {
        return set._values.length;
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function _at(Set storage set, uint256 index) private view returns (bytes32) {
        return set._values[index];
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function _values(Set storage set) private view returns (bytes32[] memory) {
        return set._values;
    }

    // Bytes32Set

    struct Bytes32Set {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(Bytes32Set storage set, bytes32 value) internal returns (bool) {
        return _add(set._inner, value);
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(Bytes32Set storage set, bytes32 value) internal returns (bool) {
        return _remove(set._inner, value);
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(Bytes32Set storage set, bytes32 value) internal view returns (bool) {
        return _contains(set._inner, value);
    }

    /**
     * @dev Returns the number of values in the set. O(1).
     */
    function length(Bytes32Set storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(Bytes32Set storage set, uint256 index) internal view returns (bytes32) {
        return _at(set._inner, index);
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function values(Bytes32Set storage set) internal view returns (bytes32[] memory) {
        bytes32[] memory store = _values(set._inner);
        bytes32[] memory result;

        /// @solidity memory-safe-assembly
        assembly {
            result := store
        }

        return result;
    }

    // AddressSet

    struct AddressSet {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(AddressSet storage set, address value) internal returns (bool) {
        return _add(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(AddressSet storage set, address value) internal returns (bool) {
        return _remove(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(AddressSet storage set, address value) internal view returns (bool) {
        return _contains(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Returns the number of values in the set. O(1).
     */
    function length(AddressSet storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(AddressSet storage set, uint256 index) internal view returns (address) {
        return address(uint160(uint256(_at(set._inner, index))));
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function values(AddressSet storage set) internal view returns (address[] memory) {
        bytes32[] memory store = _values(set._inner);
        address[] memory result;

        /// @solidity memory-safe-assembly
        assembly {
            result := store
        }

        return result;
    }

    // UintSet

    struct UintSet {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(UintSet storage set, uint256 value) internal returns (bool) {
        return _add(set._inner, bytes32(value));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(UintSet storage set, uint256 value) internal returns (bool) {
        return _remove(set._inner, bytes32(value));
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(UintSet storage set, uint256 value) internal view returns (bool) {
        return _contains(set._inner, bytes32(value));
    }

    /**
     * @dev Returns the number of values in the set. O(1).
     */
    function length(UintSet storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(UintSet storage set, uint256 index) internal view returns (uint256) {
        return uint256(_at(set._inner, index));
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function values(UintSet storage set) internal view returns (uint256[] memory) {
        bytes32[] memory store = _values(set._inner);
        uint256[] memory result;

        /// @solidity memory-safe-assembly
        assembly {
            result := store
        }

        return result;
    }
}


/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\Oracle.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;
////import "contracts/polygon/deps/openzeppelin/utils/structs/EnumerableSet.sol";
////import "contracts/polygon/diamonds/facets/Console.sol";
////import "contracts/polygon/solidstate/Api3Adaptor.sol";
////import "contracts/polygon/solidstate/ERC20/Token.sol";

interface IOracle {
    event AdaptorDeployed(address token, address denominatorToken, uint8 decimals_, address api3Address);

    function ____deployAdaptor(address token, address denominatorToken, uint8 decimals_, address api3Address) external;

    function adaptor(address token) external view returns (address);
    function hasAdaptor(address token) external view returns (bool);

    function symbolA(address token) external view returns (string memory);
    function symbolB(address token) external view returns (string memory);
    function decimals(address token) external view returns (uint8);

    function price(address token) external view returns (uint);
    function timestamp(address token) external view returns (uint);

    function isWithinTheLastHour(address token) external view returns (bool);
    function isWithinTheLastDay(address token) external view returns (bool);
    function isWithinTheLastWeek(address token) external view returns (bool);
    function isWithinTheLastMonth(address token) external view returns (bool);
}

contract Oracle {
    using EnumerableSet for EnumerableSet.AddressSet;

    bytes32 internal constant _ORACLE = keccak256("slot.oracle");

    event AdaptorDeployed(address token, address denominatorToken, uint8 decimals_, address api3Address);

    struct OracleStorage {
        mapping(address => address) adaptor;
    }

    function oracle() internal pure virtual returns (OracleStorage storage s) {
        bytes32 location = _ORACLE;
        assembly {
            s.slot := location
        }
    }

    ///

    function ____deployAdaptor(address token, address denominatorToken, uint8 decimals_, address api3Address) external virtual {
        require(_isSelfOrAdmin(), "!_isSelfOrAdmin");
        IApi3Adaptor newAdaptor = IApi3Adaptor(new Api3Adaptor());
        IToken token_ = IToken(token);
        IToken denominatorToken_ = IToken(denominatorToken);
        newAdaptor.setSymbolA = token_.symbol();
        newAdaptor.setSymbolB = denominatorToken_.symbol();
        newAdaptor.setDecimals(decimals_);
        newAdaptor.setApi3Server(api3Address);
        newAdaptor.start();
        oracle().adaptor[token] = address(newAdaptor);
        emit AdaptorDeployed(token, denominatorToken, decimals_, api3Address);
    }

    ///

    function adaptor(address token) public view virtual returns (address) {
        return oracle().api3Adaptor[feedId];
    }

    function hasAdaptor(address token) public view virtual returns (bool) {
        return adaptor(token) != address(0);
    }

    ///

    function symbolA(address token) public view virtual returns (string memory) {
        return IApi3Adaptor(adaptor(token)).symbolA();
    }

    function symbolB(address token) public view virtual returns (string memory) {
        return IApi3Adaptor(adaptor(token)).symbolB();
    }

    /// divide the price by this to get the human readable price
    function decimals(address token) public view virtual returns (uint8) {
        return IApi3Adaptor(adaptor(token)).decimals();
    }

    ///

    function price(address token) public view virtual returns (uint) {
        return IApi3Adaptor(adaptor(token)).price();
    }

    function timestamp(address token) public view virtual returns (uint) {
        return IApi3Adaptor(adaptor(token)).timestamp();
    }

    ///

    function isWithinTheLastHour(address token) public view virtual returns (bool) {
        return IApi3Adaptor(adaptor(token)).isWithinTheLastHour();
    }

    function isWithinTheLastDay(address token) public view virtual returns (bool) {
        return IApi3Adaptor(adaptor(token)).isWithinTheLastDay();
    }

    function isWithinTheLastWeek(address token) public view virtual returns (bool) {
        return IApi3Adaptor(adaptor(token)).isWithinTheLastWeek();
    }

    function isWithinTheLastMonth(address token) public view virtual returns (bool) {
        return IApi3Adaptor(adaptor(token)).isWithinTheLastMonth();
    }

    ///

    function _isSelfOrAdmin() internal view virtual returns (bool) {
        return msg.sender == IConsole(address(this)).admin() || msg.sender == address(this);
    }
}
