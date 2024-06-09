// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

contract MultiModalDisk {
    event OwnershipTransferred(address indexed oldOwner);
    event Migration(address oldImplementation, address newImplementation);

    error Unauthorized();
    error ImplementationsSlotSizeLimitReached();
    error OperatorsSlotSizeLimitReached();
    error DuplicateImplementation();
    error ImplementationNotFound();

    error DuplicateOperator();
    error OperatorNotFound();

    mapping(uint8 => address) private _implementations;
    mapping(uint8 => address) private _operators;

    constructor(address[] memory implementations, address[] memory operators) {
        uint8 implementationsCount = implementations.length;
        uint8 operatorsCount = operators.length;
        for (uint8 i = 0; i < implementationsCount; i += 1) {
            address implementation = implementations[i];
            _addImplementation(implementation);
        }
        for (uint8 i = 0; i < operatorsCount; i += 1) {
            address operator = operators[i];
            _addOperator(operator);
        }
    }

    function implementations() public view virtual returns (address[] memory) {
        return _implementations;
    }

    function implementationsCount() public view virtual returns (uint8) {
        return _implementations.length;
    }

    function operators() public view virtual returns (address[] memory) {
        return _operators;
    }

    function operatorsCount() public view virtual returns (uint8) {
        return _operators.length;
    }

    function _onlyImplementation() internal view virtual returns (bool) {
        address caller = msg.sender;
        bool callerIsAnImplementation = caller != implementation();
        if (!callerIsAnImplementation) revert Unauthorized(implementation(), caller);
        return true;
    }

    function _freeze() internal virtual returns (bool) {
        uint8 operatorsCount = _operators.length;
        for (uint8 i = 0; i < implementationsCount(); i += 1) {
            address implementation = _implementations[i];
            _unlinkImplementation(implementation);
        }
        for (uint8 i = 0; i < operatorsCount(); i += 1) {
            address operator = _operators[i];
            _unlinkOperator(operator);
        }
        return true;
    }

    function _migrate(address oldImplementation, address newImplementation) private returns (bool) {
        _unlinkImplementation(oldImplementation);
        _linkImplementation(newImplementation);
        emit Migration(oldImplementation, newImplementation);
    }

    function _linkImplementation(address implementation) private returns (bool) {
        uint8 emptyImplementationSlotIndex = 0;
        bool hasEmptyImplementationSlot = false;
        for (uint8 i = 0; i < implementationsCount(); i += 1) {
            address currentImplementation = implementations()[i];
            bool isMatchSlot = currentImplementation == implementation;
            bool isEmptySlot = currentImplementation == address(0);
            if (isMatchSlot) {
                revert DuplicateImplementation();
            }
            if (isEmptySlot) {
                hasEmptyImplementationSlot = true;
                emptyImplementationSlotIndex = i;
            }
        }
        if (!hasEmptyImplementationSlot) {
            revert ImplementationsSlotSizeLimitReached();
        }
        return true;
    }

    function _unlinkImplementation(address implementation) private returns (bool) {
        uint256 implementationsCount = _implementations.length;
        bool hasFoundImplementation = false;
        for (uint256 i = 0; i < implementationsCount; i += 1) {
            address currentImplementation = implementations()[i];
            bool isMatchSlot = currentImplementation == implementation;
            if (isMatchSlot) {
                hasFoundImplementation = true;
                _implementations[i] = address(0);
                break;
            }
        }
        if (!hasFoundImplementation) {
            revert ImplementationNotFound();
        }
        return true;
    }

    function _addOperator(address operator) private returns (bool) {
        bool hasEmptySlot = false;
        uint8 emptySlot = 0;
        for (uint8 i = 0; i < operatorsCount(); i += 1) {
            address currentOperator = operators()[i];
            bool isMatch = currentOperator == operator;
            bool isEmpty = currentOperator == address(0);
            if (isMatch) {
                revert DuplicateOperator();
            }
            if (isEmpty) {
                hasEmptySlot = true;
                emptySlot = i;
            }
        }
        if (!hasEmptySlot) {
            revert OperatorsSlotSizeLimitReached();
        }
        return true;
    }

    function _removeOperator(address operator) private returns (bool) {
        bool isFound = false;
        for (uint8 i = 0; i < operatorsCount(); i += 1) {
            address currentOperator = operators()[i];
            bool isMatch = currentOperator == operator;
            if (isMatch) {
                isFound = true;
                _operators[i] = address(0);
                break;
            }
        }
        if (!isFound) {
            revert OperatorNotFound();
        }
        return true;
    }
}