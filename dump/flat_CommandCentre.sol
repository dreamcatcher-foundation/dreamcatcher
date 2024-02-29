
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\CommandCentre.sol
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
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\CommandCentre.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;
////import "contracts/polygon/interfaces/units/20/IToken.sol";
////import "contracts/polygon/libraries/Command.sol";
////import "contracts/polygon/deps/openzeppelin/utils/structs/EnumerableSet.sol";

library CommandCentre {
    using Command for Command.Command_;
    using EnumerableSet for EnumerableSet.AddressSet;
    /// context set externally
    enum Context {
        ////IMPORTANT,
        IS_EMERGENCY,
        IS_NORMAL
    }

    struct CommandCentre_ {
        address admin;
        Context context;
        WrappedCommand[] commands;
        mapping(uint => address) commandsCreatorMapping; /// unused??
        Operator[] operators;
        Settings settings;
        bool switchedOn; /// unused spaghetti code
    }
    /// wrapping command to add caption message and creator properties
    struct WrappedCommand {
        string caption;
        string message;
        address creator;
        Command.Command_ native;
    }

    struct Operator {
        address account;
        uint lastSignedInTimestamp;
    }

    struct Settings {
        address token;
        uint minBalanceToVote;
        uint requiredSignaturesInBasisPoints;
        uint requiredSupportInBasisPoints;
        uint multiSigDuration;
        uint referendumDuration;
        uint lockDuration;
        Command.Conduct conduct;
        /// duration until operator is signed out
        uint signInDuration;
        uint minRequiredActiveOperatorsInBasisPoints;
        bool paused;
        InactiveOperatorsTriggeredPayload inactiveOperatorsTriggeredPayload;
    }
    /// in the future this method could be used to trigger commands such as elections
    struct InactiveOperatorsTriggeredPayload {
        uint lastTriggeredTimestamp;
        address target;
        bytes data;
    }

    /// checks and triggers
    function update(CommandCentre_ storage commandCentre) internal {
        if (!operatorsConditionsMet(commandCentre) && block.timestamp > commandCentre.settings.inactiveOperatorsTriggeredPayload.lastTriggeredTimestamp + commandCentre.settings.multiSigDuration + commandCentre.settings.lockDuration) {
            /// not enough operators
            commandCentre.settings.inactiveOperatorsTriggeredPayload.lastTriggeredTimestamp = block.timestamp;
            triggerCommandToSearchForNewOperators(commandCentre);
        }
    }

    function triggerCommandToSearchForNewOperators(CommandCentre_ storage commandCentre) internal {
        bytes memory emptyBytes;
        if (commandCentre.settings.inactiveOperatorsTriggeredPayload.target != address(0) && keccak256(commandCentre.settings.inactiveOperatorsTriggeredPayload.data) != keccak256(emptyBytes)) {
            commandCentre.commands.push();
            WrappedCommand storage command = commandCentre.commands[commandCentre.commands.length - 1];
            command.caption = "InactiveOperatorsTriggeredPayload";
            command.message = "";
            command.creator = address(this);
            command.native.chooseConduct(Command.Conduct.MULTI_SIG);
            /// only active operators will become signers for this command
            for (uint i = 0; i < commandCentre.operators.length; i++) {
                /// operator is active
                if (block.timestamp < commandCentre.operators[i].lastSignedInTimestamp + commandCentre.settings.signInDuration) {
                    command.native.addMultiSigSigner(commandCentre.operators[i].account);
                }
            }
            command.native.multiSig.requiredSignaturesInBasisPoints = commandCentre.settings.requiredSignaturesInBasisPoints;
            command.native.multiSig.timer.duration = commandCentre.settings.multiSigDuration;
            command.native.setUpTimelock(commandCentre.settings.lockDuration);
            command.native.addPayload(commandCentre.settings.inactiveOperatorsTriggeredPayload.target, commandCentre.settings.inactiveOperatorsTriggeredPayload.data);
            command.native.enableRequireAllCallsSuccessful();
            /// begin command lifecycle
            command.native.forward();
        }
    }

    function sendCommand(CommandCentre_ storage commandCentre, address[] memory targets, bytes[] memory data, string memory caption, string memory message, address creator, bool requireAllCallsSuccessful) internal returns (uint) {
        checkPaused(commandCentre);
        /// state machine checks
        update(commandCentre);
        require(targets.length == data.length, "Unable to send command because targets length do not match data length");
        commandCentre.commands.push();
        WrappedCommand storage command = commandCentre.commands[commandCentre.commands.length - 1];
        command.caption = caption;
        command.message = message;
        command.creator = creator;
        if (command.native.conductIsNotSet()) {
            command.native.chooseConduct(commandCentre.settings.conduct);
        }
        /// bypassing "setUpMultiSig" w custom method to add active signers
        if (command.native.conductIsMultiSigOnly() || command.native.conductIsMultiSigFirstAndReferendumSecond() || command.native.conductIsReferendumFirstAndMultiSigSecond()) {
            /// only active operators will become signers for this command
            for (uint i = 0; i < commandCentre.operators.length; i++) {
                /// operator is active
                if (block.timestamp < commandCentre.operators[i].lastSignedInTimestamp + commandCentre.settings.signInDuration) {
                    command.native.addMultiSigSigner(commandCentre.operators[i].account);
                }
            }
            command.native.multiSig.requiredSignaturesInBasisPoints = commandCentre.settings.requiredSignaturesInBasisPoints;
            command.native.multiSig.timer.duration = commandCentre.settings.multiSigDuration;
        }
        if (command.native.conductIsReferendumOnly() || command.native.conductIsMultiSigFirstAndReferendumSecond() || command.native.conductIsReferendumFirstAndMultiSigSecond()) {
            command.native.setUpReferendum(commandCentre.settings.token, commandCentre.settings.requiredSupportInBasisPoints, commandCentre.settings.referendumDuration);
        }
        command.native.setUpTimelock(commandCentre.settings.lockDuration);
        for (uint i = 0; i < targets.length; i++) {
            command.native.addPayload(targets[i], data[i]);
        }
        if (requireAllCallsSuccessful) {
            command.native.enableRequireAllCallsSuccessful();
        }
        /// begin command life cycle
        command.native.forward();
        return commandCentre.commands.length - 1;
    }

    /// unchecked with no multi sig or referendum
    function sendDirectCommand(CommandCentre_ storage commandCentre, address[] memory targets, bytes[] memory data, string memory caption, string memory message, address creator, bool requireAllCallsSuccessful) internal returns (uint) {
        /// state machine checks
        update(commandCentre);
        require(msg.sender == commandCentre.admin, "Unable to send direct command because you are not the admin");
        require(targets.length == data.length, "Unable to send command because targets length do not match data length");
        commandCentre.commands.push();
        WrappedCommand storage command = commandCentre.commands[commandCentre.commands.length - 1];
        command.caption = caption;
        command.message = message;
        command.creator = creator;
        command.native.chooseConduct(Command.Conduct.NONE);
        command.native.setUpTimelock(commandCentre.settings.lockDuration);
        for (uint i = 0; i < targets.length; i++) {
            command.native.addPayload(targets[i], data[i]);
        }
        if (requireAllCallsSuccessful) {
            command.native.enableRequireAllCallsSuccessful();
        }
        /// begin comand life cycle
        command.native.forward();
        return commandCentre.commands.length - 1;
    }

    /// progress the command
    function forwardCommand(CommandCentre_ storage commandCentre, uint identifier) internal {
        commandCentre.commands[identifier].native.forward();
    }

    function claimCommandCentre(CommandCentre_ storage commandCentre) internal {
        require(commandCentre.admin == address(0), "Unable to claim because admin role has already been claimed");
        commandCentre.admin = msg.sender;
    }

    function transferCommandCentreAdmin(CommandCentre_ storage commandCentre, address newAdmin) internal {
        require(commandCentre.admin == msg.sender, "Unable to transfer admin because you are not the admin");
        commandCentre.admin = newAdmin;
    }

    function signInAsOperator(CommandCentre_ storage commandCentre) internal {
        bool success;
        for (uint i = 0; i < commandCentre.operators.length; i++) {
            if (msg.sender == commandCentre.operators[i].account) {
                commandCentre.operators[i].lastSignedInTimestamp = block.timestamp;
                success = true;
            }
        }
        require(success, "Unable to sign in as operator because you are not an operator");
    }

    function setContext(CommandCentre_ storage commandCentre, Context newContext) internal {
        commandCentre.context = newContext;
    }

    function addOperator(CommandCentre_ storage commandCentre, address account) internal {
        require(account != address(0), "Unable to add operator because given address is zero");
        bool success;
        for (uint i = 0; i < commandCentre.operators.length; i++) {
            if (commandCentre.operators[i].account == address(0)) {
                commandCentre.operators[i].account = account;
                commandCentre.operators[i].lastSignedInTimestamp = block.timestamp;
                success = true;
            }
        }
        if (!success) {
            commandCentre.operators.push(Operator(account, block.timestamp));
            success = true;
        }
        require(success, "Unable to add operator because there may have been an error during execution");
    }

    function removeOperator(CommandCentre_ storage commandCentre, address account) internal {
        require(account != address(0), "Unable to remove operator because given address is zero");
        for (uint i = 0; i < commandCentre.operators.length; i++) {
            if (commandCentre.operators[i].account == account) {
                commandCentre.operators[i].account = address(0);
            }
        }
    }

    function isOperator(CommandCentre_ storage commandCentre, address account) internal view returns (bool) {
        for (uint i = 0; i < commandCentre.operators.length; i++) {
            if (commandCentre.operators[i].account == account) {
                return true;
            }
        }
        return false;
    }

    function setMultiSigDuration(CommandCentre_ storage commandCentre, uint newDuration) internal {
        require(newDuration != 0, "Unable to set multi sig duration because given value is zero");
        commandCentre.settings.multiSigDuration = newDuration;
    }

    function setReferendumDuration(CommandCentre_ storage commandCentre, uint newDuration) internal {
        require(newDuration != 0, "Unable to set referendum duration because given value is zero");
        commandCentre.settings.referendumDuration = newDuration;
    }

    function setTimelockDuration(CommandCentre_ storage commandCentre, uint newDuration) internal {
        require(newDuration != 0, "Unable to set timelock duration because given value is zero");
        commandCentre.settings.lockDuration = newDuration;
    }

    function setToken(CommandCentre_ storage commandCentre, address newToken) internal {
        require(newToken != address(0), "Unable to set token because given address is zero");
        require(newToken.code.length > 1, "Unable to set token because token is not a contract");
        commandCentre.settings.token = newToken;
    }

    function setRequiredSignaturesInBasisPoints(CommandCentre_ storage commandCentre, uint newValue) internal {
        require(newValue <= 10000, "Unable to set required signatures in basis points because value is greater than 10000");
        commandCentre.settings.requiredSignaturesInBasisPoints = newValue;
    }

    function setRequiredSupportInBasisPoints(CommandCentre_ storage commandCentre, uint newValue) internal {
        require(newValue <= 10000, "Unable to set required support in basis points because value is greater than 10000");
        commandCentre.settings.requiredSupportInBasisPoints = newValue;
    }

    function setMinBalanceToVote(CommandCentre_ storage commandCentre, uint newAmount) internal {
        commandCentre.settings.minBalanceToVote = newAmount;
    }

    function setConduct(CommandCentre_ storage commandCentre, Command.Conduct newConduct) internal {
        commandCentre.settings.conduct = newConduct;
    }

    function setSignInDuration(CommandCentre_ storage commandCentre, uint newDuration) internal {
        commandCentre.settings.signInDuration = newDuration;
    }

    function setMinRequiredActiveOperatorsInBasisPoints(CommandCentre_ storage commandCentre, uint newValue) internal {
        require(newValue <= 10000, "Unable to set min required active operators in basis points because value is greater than 10000");
        commandCentre.settings.minRequiredActiveOperatorsInBasisPoints = newValue;
    }

    function setInactiveOperatorsTriggeredPayload(CommandCentre_ storage commandCentre, address target, bytes memory data) internal {
        bytes memory emptyBytes;
        require(target != address(0) && keccak256(data) != keccak256(emptyBytes), "Unable to set inactive operators triggered payload because one or both given args are empty");
        commandCentre.settings.inactiveOperatorsTriggeredPayload = InactiveOperatorsTriggeredPayload(0, target, data);
    }

    function pause(CommandCentre_ storage commandCentre) internal {
        commandCentre.settings.paused = true;
    }

    function unpause(CommandCentre_ storage commandCentre) internal {
        commandCentre.settings.paused = false;
    }

    function checkPaused(CommandCentre_ storage commandCentre) internal view {
        require(commandCentre.settings.paused == false, "Unable to proceed because command centre is paused");
    }

    /// checks that there are enough active operators
    function operatorsConditionsMet(CommandCentre_ storage commandCentre) internal view returns (bool) {
        (uint active, , uint numOperators) = checkOperatorsState(commandCentre);
        /// **div by zero
        if (numOperators >= 2) {
            if (((active * 10000) / numOperators) >= commandCentre.settings.minRequiredActiveOperatorsInBasisPoints) {
                return true;
            }
        } else {
            /// if there ar eno more than two operators then will return true regardless
            return true;
        }

        return false;
    }

    function checkOperatorsState(CommandCentre_ storage commandCentre) internal view returns (uint, uint, uint) {
        uint active;
        uint inactive;
        uint numOperators;
        for (uint i = 0; i < commandCentre.operators.length; i++) {
            if (block.timestamp >= commandCentre.operators[i].lastSignedInTimestamp + commandCentre.settings.signInDuration) {
                inactive ++;
            } else {
                active ++;
            }
            numOperators ++;
        }
        return (active, inactive, numOperators);
    }

    function ////Important(CommandCentre_ storage commandCentre) internal view returns (bool) {
        return commandCentre.context == Context.IS_IMPORTANT;
    }

    function contextIsEmergency(CommandCentre_ storage commandCentre) internal view returns (bool) {
        return commandCentre.context == Context.IS_EMERGENCY;
    }

    function contextIsNormal(CommandCentre_ storage commandCentre) internal view returns (bool) {
        return commandCentre.context == Context.IS_NORMAL;
    }
}
