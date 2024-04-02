

// Sources flattened with hardhat v2.21.0 https://hardhat.org

// SPDX-License-Identifier: Apache-2.0 AND MIT

// File code/build/DokaBuild/static/sol/src/native/interface/IFacet.sol

// Original license: SPDX_License_Identifier: Apache-2.0
pragma solidity ^0.8.19;

interface IFacet {
    function selectors() external pure returns (bytes4[] memory);
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/interfaces/IERC173Internal.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;

/**
 * @title Partial ERC173 interface needed by internal functions
 */
interface IERC173Internal {
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/access/ownable/IOwnableInternal.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
interface IOwnableInternal is IERC173Internal {
    error Ownable__NotOwner();
    error Ownable__NotTransitiveOwner();
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/interfaces/IERC173.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
/**
 * @title Contract ownership standard interface
 * @dev see https://eips.ethereum.org/EIPS/eip-173
 */
interface IERC173 is IERC173Internal {
    /**
     * @notice get the ERC173 contract owner
     * @return contract owner
     */
    function owner() external view returns (address);

    /**
     * @notice transfer contract ownership to new account
     * @param account address of new owner
     */
    function transferOwnership(address account) external;
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/access/ownable/IOwnable.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
interface IOwnable is IOwnableInternal, IERC173 {}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/access/ownable/OwnableStorage.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;

library OwnableStorage {
    struct Layout {
        address owner;
    }

    bytes32 internal constant STORAGE_SLOT =
        keccak256('solidstate.contracts.storage.Ownable');

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/utils/UintUtils.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;

/**
 * @title utility functions for uint256 operations
 * @dev derived from https://github.com/OpenZeppelin/openzeppelin-contracts/ (MIT license)
 */
library UintUtils {
    error UintUtils__InsufficientPadding();
    error UintUtils__InvalidBase();

    bytes16 private constant HEX_SYMBOLS = '0123456789abcdef';

    function add(uint256 a, int256 b) internal pure returns (uint256) {
        return b < 0 ? sub(a, -b) : a + uint256(b);
    }

    function sub(uint256 a, int256 b) internal pure returns (uint256) {
        return b < 0 ? add(a, -b) : a - uint256(b);
    }

    /**
     * @notice output the string representation of a number in a given radix
     * @dev radix must be between 2 and 36 (inclusive)
     * @param value number to format as string
     * @param radix numerical base to use
     * @return output formatted string
     */
    function toString(
        uint256 value,
        uint256 radix
    ) internal pure returns (string memory output) {
        // this check is repeated in the internal call to #toString(uint256,uint256,uint256)
        // but is still needed here to avoid zero division (radix = 0) or infinite loop (radix = 1)
        if (radix < 2) {
            revert UintUtils__InvalidBase();
        }

        uint256 length;
        uint256 temp = value;

        do {
            unchecked {
                length++;
            }
            temp /= radix;
        } while (temp != 0);

        output = toString(value, radix, length);
    }

    /**
     * @notice output the string representation of a number in a given radix and padded to given length
     * @dev radix must be between 2 and 36 (inclusive)
     * @param value number to format as string
     * @param radix numerical base to use
     * @param length size to which output should be zero padded
     * @return output formatted string
     */
    function toString(
        uint256 value,
        uint256 radix,
        uint256 length
    ) internal pure returns (string memory output) {
        if (radix < 2 || radix > 36) {
            revert UintUtils__InvalidBase();
        }

        bytes memory buffer = new bytes(length);

        while (length != 0) {
            unchecked {
                length--;
            }

            uint256 char = value % radix;

            if (char < 10) {
                // for numeral characters, shift 48 places through ASCII character set
                // 48 can be added using bitwise-or because its binary is 00110000
                char |= 48;
            } else {
                // for alphabetical characters, shift 87 places through ASCII character set
                unchecked {
                    char += 87;
                }
            }

            buffer[length] = bytes1(uint8(char));
            value /= radix;
        }

        if (value != 0) revert UintUtils__InsufficientPadding();

        output = string(buffer);
    }

    /**
     * @notice output the 0b-prefixed binary string representation of a number
     * @param value number to format as string
     * @return output formatted string
     */
    function toBinString(
        uint256 value
    ) internal pure returns (string memory output) {
        uint256 length;
        uint256 temp = value;

        do {
            unchecked {
                length++;
            }
            temp >>= 1;
        } while (temp != 0);

        output = toBinString(value, length);
    }

    /**
     * @notice output the 0b-prefixed binary string representation of a number padded to given length
     * @param value number to format as string
     * @param length size to which output should be zero padded (not including prefix)
     * @return output formatted string
     */
    function toBinString(
        uint256 value,
        uint256 length
    ) internal pure returns (string memory output) {
        // add two to length for the leading "0b"
        length += 2;

        bytes memory buffer = new bytes(length);
        buffer[0] = '0';
        buffer[1] = 'b';

        while (length > 2) {
            unchecked {
                length--;
            }

            buffer[length] = HEX_SYMBOLS[value & 1];
            value >>= 1;
        }

        if (value != 0) revert UintUtils__InsufficientPadding();

        output = string(buffer);
    }

    /**
     * @notice output the 0o-prefixed octal string representation of a number
     * @param value number to format as string
     * @return output formatted string
     */
    function toOctString(
        uint256 value
    ) internal pure returns (string memory output) {
        uint256 length;
        uint256 temp = value;

        do {
            unchecked {
                length++;
            }
            temp >>= 3;
        } while (temp != 0);

        output = toOctString(value, length);
    }

    /**
     * @notice output the 0o-prefixed octal string representation of a number padded to given length
     * @param value number to format as string
     * @param length size to which output should be zero padded (not including prefix)
     * @return output formatted string
     */
    function toOctString(
        uint256 value,
        uint256 length
    ) internal pure returns (string memory output) {
        // add two to length for the leading "0o"
        length += 2;

        bytes memory buffer = new bytes(length);
        buffer[0] = '0';
        buffer[1] = 'o';

        while (length > 2) {
            unchecked {
                length--;
            }

            buffer[length] = HEX_SYMBOLS[value & 7];
            value >>= 3;
        }

        if (value != 0) revert UintUtils__InsufficientPadding();

        output = string(buffer);
    }

    /**
     * @notice output the decimal string representation of a number
     * @param value number to format as string
     * @return output formatted string
     */
    function toDecString(
        uint256 value
    ) internal pure returns (string memory output) {
        output = toString(value, 10);
    }

    /**
     * @notice output the decimal string representation of a number padded to given length
     * @param value number to format as string
     * @param length size to which output should be zero padded
     * @return output formatted string
     */
    function toDecString(
        uint256 value,
        uint256 length
    ) internal pure returns (string memory output) {
        output = toString(value, 10, length);
    }

    /**
     * @notice output the 0x-prefixed hexadecimal string representation of a number
     * @dev calculated string length will always be even to prevent splitting of bytes
     * @param value number to format as string
     * @return output formatted string
     */
    function toHexString(
        uint256 value
    ) internal pure returns (string memory output) {
        uint256 length;
        uint256 temp = value;

        do {
            unchecked {
                length++;
            }
            temp >>= 8;
        } while (temp != 0);

        output = toHexString(value, length);
    }

    /**
     * @notice output the 0x-prefixed hexadecimal string representation of a number padded to given length
     * @dev calculated string length will always be even to prevent splitting of bytes
     * @param value number to format as string
     * @param length size (in bytes) to which output should be zero padded (not including prefix)
     * @return output formatted string
     */
    function toHexString(
        uint256 value,
        uint256 length
    ) internal pure returns (string memory output) {
        // convert byte length to character length and add two to length for the leading "0x"
        unchecked {
            length = (length << 1) + 2;
        }

        bytes memory buffer = new bytes(length);
        buffer[0] = '0';
        buffer[1] = 'x';

        while (length > 2) {
            unchecked {
                length--;
            }

            buffer[length] = HEX_SYMBOLS[value & 15];
            value >>= 4;
        }

        if (value != 0) revert UintUtils__InsufficientPadding();

        output = string(buffer);
    }
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/utils/AddressUtils.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
library AddressUtils {
    using UintUtils for uint256;

    error AddressUtils__InsufficientBalance();
    error AddressUtils__NotContract();
    error AddressUtils__SendValueFailed();

    function toString(address account) internal pure returns (string memory) {
        return uint256(uint160(account)).toHexString(20);
    }

    function isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

    function sendValue(address payable account, uint256 amount) internal {
        (bool success, ) = account.call{ value: amount }('');
        if (!success) revert AddressUtils__SendValueFailed();
    }

    function functionCall(
        address target,
        bytes memory data
    ) internal returns (bytes memory) {
        return
            functionCall(target, data, 'AddressUtils: failed low-level call');
    }

    function functionCall(
        address target,
        bytes memory data,
        string memory error
    ) internal returns (bytes memory) {
        return _functionCallWithValue(target, data, 0, error);
    }

    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bytes memory) {
        return
            functionCallWithValue(
                target,
                data,
                value,
                'AddressUtils: failed low-level call with value'
            );
    }

    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory error
    ) internal returns (bytes memory) {
        if (value > address(this).balance)
            revert AddressUtils__InsufficientBalance();
        return _functionCallWithValue(target, data, value, error);
    }

    /**
     * @notice execute arbitrary external call with limited gas usage and amount of copied return data
     * @dev derived from https://github.com/nomad-xyz/ExcessivelySafeCall (MIT License)
     * @param target recipient of call
     * @param gasAmount gas allowance for call
     * @param value native token value to include in call
     * @param maxCopy maximum number of bytes to copy from return data
     * @param data encoded call data
     * @return success whether call is successful
     * @return returnData copied return data
     */
    function excessivelySafeCall(
        address target,
        uint256 gasAmount,
        uint256 value,
        uint16 maxCopy,
        bytes memory data
    ) internal returns (bool success, bytes memory returnData) {
        returnData = new bytes(maxCopy);

        assembly {
            // execute external call via assembly to avoid automatic copying of return data
            success := call(
                gasAmount,
                target,
                value,
                add(data, 0x20),
                mload(data),
                0,
                0
            )

            // determine whether to limit amount of data to copy
            let toCopy := returndatasize()

            if gt(toCopy, maxCopy) {
                toCopy := maxCopy
            }

            // store the length of the copied bytes
            mstore(returnData, toCopy)

            // copy the bytes from returndata[0:toCopy]
            returndatacopy(add(returnData, 0x20), 0, toCopy)
        }
    }

    function _functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory error
    ) private returns (bytes memory) {
        if (!isContract(target)) revert AddressUtils__NotContract();

        (bool success, bytes memory returnData) = target.call{ value: value }(
            data
        );

        if (success) {
            return returnData;
        } else if (returnData.length > 0) {
            assembly {
                let returnData_size := mload(returnData)
                revert(add(32, returnData), returnData_size)
            }
        } else {
            revert(error);
        }
    }
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/access/ownable/OwnableInternal.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
abstract contract OwnableInternal is IOwnableInternal {
    using AddressUtils for address;

    modifier onlyOwner() {
        if (msg.sender != _owner()) revert Ownable__NotOwner();
        _;
    }

    modifier onlyTransitiveOwner() {
        if (msg.sender != _transitiveOwner())
            revert Ownable__NotTransitiveOwner();
        _;
    }

    function _owner() internal view virtual returns (address) {
        return OwnableStorage.layout().owner;
    }

    function _transitiveOwner() internal view virtual returns (address owner) {
        owner = _owner();

        while (owner.isContract()) {
            try IERC173(owner).owner() returns (address transitiveOwner) {
                owner = transitiveOwner;
            } catch {
                break;
            }
        }
    }

    function _transferOwnership(address account) internal virtual {
        _setOwner(account);
    }

    function _setOwner(address account) internal virtual {
        OwnableStorage.Layout storage l = OwnableStorage.layout();
        emit OwnershipTransferred(l.owner, account);
        l.owner = account;
    }
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/access/ownable/Ownable.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
/**
 * @title Ownership access control based on ERC173
 */
abstract contract Ownable is IOwnable, OwnableInternal {
    /**
     * @inheritdoc IERC173
     */
    function owner() public view virtual returns (address) {
        return _owner();
    }

    /**
     * @inheritdoc IERC173
     */
    function transferOwnership(address account) public virtual onlyOwner {
        _transferOwnership(account);
    }
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/access/ownable/ISafeOwnableInternal.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
interface ISafeOwnableInternal is IOwnableInternal {
    error SafeOwnable__NotNomineeOwner();
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/access/ownable/ISafeOwnable.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
interface ISafeOwnable is ISafeOwnableInternal, IOwnable {
    /**
     * @notice get the nominated owner who has permission to call acceptOwnership
     */
    function nomineeOwner() external view returns (address);

    /**
     * @notice accept transfer of contract ownership
     */
    function acceptOwnership() external;
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/access/ownable/SafeOwnableStorage.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;

library SafeOwnableStorage {
    struct Layout {
        address nomineeOwner;
    }

    bytes32 internal constant STORAGE_SLOT =
        keccak256('solidstate.contracts.storage.SafeOwnable');

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/access/ownable/SafeOwnableInternal.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
abstract contract SafeOwnableInternal is ISafeOwnableInternal, OwnableInternal {
    modifier onlyNomineeOwner() {
        if (msg.sender != _nomineeOwner())
            revert SafeOwnable__NotNomineeOwner();
        _;
    }

    /**
     * @notice get the nominated owner who has permission to call acceptOwnership
     */
    function _nomineeOwner() internal view virtual returns (address) {
        return SafeOwnableStorage.layout().nomineeOwner;
    }

    /**
     * @notice accept transfer of contract ownership
     */
    function _acceptOwnership() internal virtual {
        _setOwner(msg.sender);
        delete SafeOwnableStorage.layout().nomineeOwner;
    }

    /**
     * @notice grant permission to given address to claim contract ownership
     */
    function _transferOwnership(address account) internal virtual override {
        _setNomineeOwner(account);
    }

    /**
     * @notice set nominee owner
     */
    function _setNomineeOwner(address account) internal virtual {
        SafeOwnableStorage.layout().nomineeOwner = account;
    }
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/access/ownable/SafeOwnable.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
/**
 * @title Ownership access control based on ERC173 with ownership transfer safety check
 */
abstract contract SafeOwnable is ISafeOwnable, Ownable, SafeOwnableInternal {
    /**
     * @inheritdoc ISafeOwnable
     */
    function nomineeOwner() public view virtual returns (address) {
        return _nomineeOwner();
    }

    /**
     * @inheritdoc ISafeOwnable
     */
    function acceptOwnership() public virtual onlyNomineeOwner {
        _acceptOwnership();
    }

    function _transferOwnership(
        address account
    ) internal virtual override(OwnableInternal, SafeOwnableInternal) {
        super._transferOwnership(account);
    }
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/interfaces/IERC165Internal.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;

/**
 * @title ERC165 interface registration interface
 */
interface IERC165Internal {

}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/interfaces/IERC165.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
/**
 * @title ERC165 interface registration interface
 * @dev see https://eips.ethereum.org/EIPS/eip-165
 */
interface IERC165 is IERC165Internal {
    /**
     * @notice query whether contract has registered support for given interface
     * @param interfaceId interface id
     * @return bool whether interface is supported
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/interfaces/IERC2535DiamondCutInternal.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;

/**
 * @title ERC2535 write interface for internal functions
 * @dev see https://eips.ethereum.org/EIPS/eip-2535
 */
interface IERC2535DiamondCutInternal {
    enum FacetCutAction {
        ADD,
        REPLACE,
        REMOVE
    }

    struct FacetCut {
        address target;
        FacetCutAction action;
        bytes4[] selectors;
    }

    event DiamondCut(FacetCut[] facetCuts, address target, bytes data);
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/interfaces/IERC2535DiamondCut.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
/**
 * @title ERC2535 write interface
 * @dev see https://eips.ethereum.org/EIPS/eip-2535
 */
interface IERC2535DiamondCut is IERC2535DiamondCutInternal {
    /**
     * @notice update diamond facets and optionally execute arbitrary initialization function
     * @param facetCuts array of structured Diamond facet update data
     * @param target optional target of initialization delegatecall
     * @param data optional initialization function call data
     */
    function diamondCut(
        FacetCut[] calldata facetCuts,
        address target,
        bytes calldata data
    ) external;
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/interfaces/IERC2535DiamondLoupeInternal.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;

/**
 * @title ERC2535 read interface for internal functions
 * @dev see https://eips.ethereum.org/EIPS/eip-2535
 */
interface IERC2535DiamondLoupeInternal {
    struct Facet {
        address target;
        bytes4[] selectors;
    }
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/interfaces/IERC2535DiamondLoupe.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
/**
 * @title ERC2535 read interface
 * @dev see https://eips.ethereum.org/EIPS/eip-2535
 */
interface IERC2535DiamondLoupe is IERC2535DiamondLoupeInternal {
    /**
     * @notice get all facets and their selectors
     * @return diamondFacets array of structured facet data
     */
    function facets() external view returns (Facet[] memory diamondFacets);

    /**
     * @notice get all selectors for given facet address
     * @param facet address of facet to query
     * @return selectors array of function selectors
     */
    function facetFunctionSelectors(
        address facet
    ) external view returns (bytes4[] memory selectors);

    /**
     * @notice get addresses of all facets used by diamond
     * @return addresses array of facet addresses
     */
    function facetAddresses()
        external
        view
        returns (address[] memory addresses);

    /**
     * @notice get the address of the facet associated with given selector
     * @param selector function selector to query
     * @return facet facet address (zero address if not found)
     */
    function facetAddress(
        bytes4 selector
    ) external view returns (address facet);
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/introspection/ERC165/base/ERC165BaseStorage.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;

library ERC165BaseStorage {
    struct Layout {
        mapping(bytes4 => bool) supportedInterfaces;
    }

    bytes32 internal constant STORAGE_SLOT =
        keccak256('solidstate.contracts.storage.ERC165Base');

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/introspection/ERC165/base/IERC165BaseInternal.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
interface IERC165BaseInternal is IERC165Internal {
    error ERC165Base__InvalidInterfaceId();
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/introspection/ERC165/base/ERC165BaseInternal.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
/**
 * @title ERC165 implementation
 */
abstract contract ERC165BaseInternal is IERC165BaseInternal {
    /**
     * @notice indicates whether an interface is already supported based on the interfaceId
     * @param interfaceId id of interface to check
     * @return bool indicating whether interface is supported
     */
    function _supportsInterface(
        bytes4 interfaceId
    ) internal view virtual returns (bool) {
        return ERC165BaseStorage.layout().supportedInterfaces[interfaceId];
    }

    /**
     * @notice sets status of interface support
     * @param interfaceId id of interface to set status for
     * @param status boolean indicating whether interface will be set as supported
     */
    function _setSupportsInterface(
        bytes4 interfaceId,
        bool status
    ) internal virtual {
        if (interfaceId == 0xffffffff) revert ERC165Base__InvalidInterfaceId();
        ERC165BaseStorage.layout().supportedInterfaces[interfaceId] = status;
    }
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/introspection/ERC165/base/IERC165Base.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
interface IERC165Base is IERC165, IERC165BaseInternal {}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/introspection/ERC165/base/ERC165Base.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
/**
 * @title ERC165 implementation
 */
abstract contract ERC165Base is IERC165Base, ERC165BaseInternal {
    /**
     * @inheritdoc IERC165
     */
    function supportsInterface(bytes4 interfaceId) public view returns (bool) {
        return _supportsInterface(interfaceId);
    }
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/proxy/diamond/base/DiamondBaseStorage.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;

/**
 * @dev derived from https://github.com/mudgen/diamond-2 (MIT license)
 */
library DiamondBaseStorage {
    struct Layout {
        // function selector => (facet address, selector slot position)
        mapping(bytes4 => bytes32) facets;
        // total number of selectors registered
        uint16 selectorCount;
        // array of selector slots with 8 selectors per slot
        mapping(uint256 => bytes32) selectorSlots;
        address fallbackAddress;
    }

    bytes32 internal constant STORAGE_SLOT =
        keccak256('solidstate.contracts.storage.DiamondBase');

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/proxy/IProxy.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;

interface IProxy {
    error Proxy__ImplementationIsNotContract();

    fallback() external payable;
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/proxy/diamond/base/IDiamondBase.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
interface IDiamondBase is IProxy {}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/proxy/Proxy.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
/**
 * @title Base proxy contract
 */
abstract contract Proxy is IProxy {
    using AddressUtils for address;

    /**
     * @notice delegate all calls to implementation contract
     * @dev reverts if implementation address contains no code, for compatibility with metamorphic contracts
     * @dev memory location in use by assembly may be unsafe in other contexts
     */
    fallback() external payable virtual {
        address implementation = _getImplementation();

        if (!implementation.isContract())
            revert Proxy__ImplementationIsNotContract();

        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(
                gas(),
                implementation,
                0,
                calldatasize(),
                0,
                0
            )
            returndatacopy(0, 0, returndatasize())

            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    /**
     * @notice get logic implementation address
     * @return implementation address
     */
    function _getImplementation() internal virtual returns (address);
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/proxy/diamond/base/DiamondBase.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
/**
 * @title EIP-2535 "Diamond" proxy base contract
 * @dev see https://eips.ethereum.org/EIPS/eip-2535
 * @dev note that for EIP-2535 compliance this base contract must also include the DiamondReadable functions (either within the same deployment or by proxy)
 */
abstract contract DiamondBase is IDiamondBase, Proxy {
    /**
     * @inheritdoc Proxy
     */
    function _getImplementation()
        internal
        view
        virtual
        override
        returns (address implementation)
    {
        // inline storage layout retrieval uses less gas
        DiamondBaseStorage.Layout storage l;
        bytes32 slot = DiamondBaseStorage.STORAGE_SLOT;
        assembly {
            l.slot := slot
        }

        implementation = address(bytes20(l.facets[msg.sig]));
    }
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/proxy/diamond/fallback/IDiamondFallback.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
interface IDiamondFallback is IDiamondBase {
    /**
     * @notice query the address of the fallback implementation
     * @return fallbackAddress address of fallback implementation
     */
    function getFallbackAddress()
        external
        view
        returns (address fallbackAddress);

    /**
     * @notice set the address of the fallback implementation
     * @param fallbackAddress address of fallback implementation
     */
    function setFallbackAddress(address fallbackAddress) external;
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/proxy/diamond/fallback/DiamondFallback.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
/**
 * @title Fallback feature for EIP-2535 "Diamond" proxy
 */
abstract contract DiamondFallback is
    IDiamondFallback,
    OwnableInternal,
    DiamondBase
{
    /**
     * @inheritdoc IDiamondFallback
     */
    function getFallbackAddress()
        external
        view
        returns (address fallbackAddress)
    {
        fallbackAddress = _getFallbackAddress();
    }

    /**
     * @inheritdoc IDiamondFallback
     */
    function setFallbackAddress(address fallbackAddress) external onlyOwner {
        _setFallbackAddress(fallbackAddress);
    }

    /**
     * @inheritdoc DiamondBase
     * @notice query custom fallback address is no implementation is found
     */
    function _getImplementation()
        internal
        view
        virtual
        override
        returns (address implementation)
    {
        implementation = super._getImplementation();

        if (implementation == address(0)) {
            implementation = _getFallbackAddress();
        }
    }

    /**
     * @notice query the address of the fallback implementation
     * @return fallbackAddress address of fallback implementation
     */
    function _getFallbackAddress()
        internal
        view
        virtual
        returns (address fallbackAddress)
    {
        fallbackAddress = DiamondBaseStorage.layout().fallbackAddress;
    }

    /**
     * @notice set the address of the fallback implementation
     * @param fallbackAddress address of fallback implementation
     */
    function _setFallbackAddress(address fallbackAddress) internal virtual {
        DiamondBaseStorage.layout().fallbackAddress = fallbackAddress;
    }
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/proxy/diamond/readable/IDiamondReadableInternal.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
/**
 * @title Diamond proxy introspection interface needed for internal functions
 * @dev see https://eips.ethereum.org/EIPS/eip-2535
 */
interface IDiamondReadableInternal is IERC2535DiamondLoupeInternal {

}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/proxy/diamond/readable/IDiamondReadable.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
/**
 * @title Diamond proxy introspection interface
 * @dev see https://eips.ethereum.org/EIPS/eip-2535
 */
interface IDiamondReadable is IERC2535DiamondLoupe, IDiamondReadableInternal {

}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/proxy/diamond/writable/IDiamondWritableInternal.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
interface IDiamondWritableInternal is IERC2535DiamondCutInternal {
    error DiamondWritable__InvalidInitializationParameters();
    error DiamondWritable__RemoveTargetNotZeroAddress();
    error DiamondWritable__ReplaceTargetIsIdentical();
    error DiamondWritable__SelectorAlreadyAdded();
    error DiamondWritable__SelectorIsImmutable();
    error DiamondWritable__SelectorNotFound();
    error DiamondWritable__SelectorNotSpecified();
    error DiamondWritable__TargetHasNoCode();
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/proxy/diamond/writable/IDiamondWritable.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
/**
 * @title Diamond proxy upgrade interface
 * @dev see https://eips.ethereum.org/EIPS/eip-2535
 */
interface IDiamondWritable is IERC2535DiamondCut, IDiamondWritableInternal {

}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/proxy/diamond/ISolidStateDiamond.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
interface ISolidStateDiamond is
    IDiamondBase,
    IDiamondFallback,
    IDiamondReadable,
    IDiamondWritable,
    ISafeOwnable,
    IERC165
{
    receive() external payable;
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/proxy/diamond/readable/DiamondReadableInternal.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
/**
 * @title EIP-2535 "Diamond" proxy introspection contract internal functions
 * @dev derived from https://github.com/mudgen/diamond-2 (MIT license)
 */
abstract contract DiamondReadableInternal is IDiamondReadableInternal {
    /**
     * @notice get all facets and their selectors
     * @return diamondFacets array of structured facet data
     */
    function _facets() internal view returns (Facet[] memory diamondFacets) {
        DiamondBaseStorage.Layout storage l = DiamondBaseStorage.layout();

        diamondFacets = new Facet[](l.selectorCount);

        uint8[] memory numFacetSelectors = new uint8[](l.selectorCount);
        uint256 numFacets;
        uint256 selectorIndex;

        // loop through function selectors
        for (uint256 slotIndex; selectorIndex < l.selectorCount; slotIndex++) {
            bytes32 slot = l.selectorSlots[slotIndex];

            for (
                uint256 selectorSlotIndex;
                selectorSlotIndex < 8;
                selectorSlotIndex++
            ) {
                selectorIndex++;

                if (selectorIndex > l.selectorCount) {
                    break;
                }

                bytes4 selector = bytes4(slot << (selectorSlotIndex << 5));
                address facet = address(bytes20(l.facets[selector]));

                bool continueLoop;

                for (uint256 facetIndex; facetIndex < numFacets; facetIndex++) {
                    if (diamondFacets[facetIndex].target == facet) {
                        diamondFacets[facetIndex].selectors[
                            numFacetSelectors[facetIndex]
                        ] = selector;
                        // probably will never have more than 256 functions from one facet contract
                        require(numFacetSelectors[facetIndex] < 255);
                        numFacetSelectors[facetIndex]++;
                        continueLoop = true;
                        break;
                    }
                }

                if (continueLoop) {
                    continue;
                }

                diamondFacets[numFacets].target = facet;
                diamondFacets[numFacets].selectors = new bytes4[](
                    l.selectorCount
                );
                diamondFacets[numFacets].selectors[0] = selector;
                numFacetSelectors[numFacets] = 1;
                numFacets++;
            }
        }

        for (uint256 facetIndex; facetIndex < numFacets; facetIndex++) {
            uint256 numSelectors = numFacetSelectors[facetIndex];
            bytes4[] memory selectors = diamondFacets[facetIndex].selectors;

            // setting the number of selectors
            assembly {
                mstore(selectors, numSelectors)
            }
        }

        // setting the number of facets
        assembly {
            mstore(diamondFacets, numFacets)
        }
    }

    /**
     * @notice get all selectors for given facet address
     * @param facet address of facet to query
     * @return selectors array of function selectors
     */
    function _facetFunctionSelectors(
        address facet
    ) internal view returns (bytes4[] memory selectors) {
        DiamondBaseStorage.Layout storage l = DiamondBaseStorage.layout();

        selectors = new bytes4[](l.selectorCount);

        uint256 numSelectors;
        uint256 selectorIndex;

        // loop through function selectors
        for (uint256 slotIndex; selectorIndex < l.selectorCount; slotIndex++) {
            bytes32 slot = l.selectorSlots[slotIndex];

            for (
                uint256 selectorSlotIndex;
                selectorSlotIndex < 8;
                selectorSlotIndex++
            ) {
                selectorIndex++;

                if (selectorIndex > l.selectorCount) {
                    break;
                }

                bytes4 selector = bytes4(slot << (selectorSlotIndex << 5));

                if (facet == address(bytes20(l.facets[selector]))) {
                    selectors[numSelectors] = selector;
                    numSelectors++;
                }
            }
        }

        // set the number of selectors in the array
        assembly {
            mstore(selectors, numSelectors)
        }
    }

    /**
     * @notice get addresses of all facets used by diamond
     * @return addresses array of facet addresses
     */
    function _facetAddresses()
        internal
        view
        returns (address[] memory addresses)
    {
        DiamondBaseStorage.Layout storage l = DiamondBaseStorage.layout();

        addresses = new address[](l.selectorCount);
        uint256 numFacets;
        uint256 selectorIndex;

        for (uint256 slotIndex; selectorIndex < l.selectorCount; slotIndex++) {
            bytes32 slot = l.selectorSlots[slotIndex];

            for (
                uint256 selectorSlotIndex;
                selectorSlotIndex < 8;
                selectorSlotIndex++
            ) {
                selectorIndex++;

                if (selectorIndex > l.selectorCount) {
                    break;
                }

                bytes4 selector = bytes4(slot << (selectorSlotIndex << 5));
                address facet = address(bytes20(l.facets[selector]));

                bool continueLoop;

                for (uint256 facetIndex; facetIndex < numFacets; facetIndex++) {
                    if (facet == addresses[facetIndex]) {
                        continueLoop = true;
                        break;
                    }
                }

                if (continueLoop) {
                    continue;
                }

                addresses[numFacets] = facet;
                numFacets++;
            }
        }

        // set the number of facet addresses in the array
        assembly {
            mstore(addresses, numFacets)
        }
    }

    /**
     * @notice get the address of the facet associated with given selector
     * @param selector function selector to query
     * @return facet facet address (zero address if not found)
     */
    function _facetAddress(
        bytes4 selector
    ) internal view returns (address facet) {
        facet = address(bytes20(DiamondBaseStorage.layout().facets[selector]));
    }
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/proxy/diamond/readable/DiamondReadable.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
/**
 * @title EIP-2535 "Diamond" proxy introspection contract
 * @dev derived from https://github.com/mudgen/diamond-2 (MIT license)
 */
abstract contract DiamondReadable is IDiamondReadable, DiamondReadableInternal {
    /**
     * @inheritdoc IERC2535DiamondLoupe
     */
    function facets() external view returns (Facet[] memory diamondFacets) {
        diamondFacets = _facets();
    }

    /**
     * @inheritdoc IERC2535DiamondLoupe
     */
    function facetFunctionSelectors(
        address facet
    ) external view returns (bytes4[] memory selectors) {
        selectors = _facetFunctionSelectors(facet);
    }

    /**
     * @inheritdoc IERC2535DiamondLoupe
     */
    function facetAddresses()
        external
        view
        returns (address[] memory addresses)
    {
        addresses = _facetAddresses();
    }

    /**
     * @inheritdoc IERC2535DiamondLoupe
     */
    function facetAddress(
        bytes4 selector
    ) external view returns (address facet) {
        facet = _facetAddress(selector);
    }
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/proxy/diamond/writable/DiamondWritableInternal.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
abstract contract DiamondWritableInternal is IDiamondWritableInternal {
    using AddressUtils for address;

    bytes32 private constant CLEAR_ADDRESS_MASK =
        bytes32(uint256(0xffffffffffffffffffffffff));
    bytes32 private constant CLEAR_SELECTOR_MASK =
        bytes32(uint256(0xffffffff << 224));

    /**
     * @notice update functions callable on Diamond proxy
     * @param facetCuts array of structured Diamond facet update data
     * @param target optional recipient of initialization delegatecall
     * @param data optional initialization call data
     */
    function _diamondCut(
        FacetCut[] memory facetCuts,
        address target,
        bytes memory data
    ) internal virtual {
        DiamondBaseStorage.Layout storage l = DiamondBaseStorage.layout();

        unchecked {
            uint256 originalSelectorCount = l.selectorCount;
            uint256 selectorCount = originalSelectorCount;
            bytes32 selectorSlot;

            // Check if last selector slot is not full
            if (selectorCount & 7 > 0) {
                // get last selectorSlot
                selectorSlot = l.selectorSlots[selectorCount >> 3];
            }

            for (uint256 i; i < facetCuts.length; i++) {
                FacetCut memory facetCut = facetCuts[i];
                FacetCutAction action = facetCut.action;

                if (facetCut.selectors.length == 0)
                    revert DiamondWritable__SelectorNotSpecified();

                if (action == FacetCutAction.ADD) {
                    (selectorCount, selectorSlot) = _addFacetSelectors(
                        l,
                        selectorCount,
                        selectorSlot,
                        facetCut
                    );
                } else if (action == FacetCutAction.REPLACE) {
                    _replaceFacetSelectors(l, facetCut);
                } else if (action == FacetCutAction.REMOVE) {
                    (selectorCount, selectorSlot) = _removeFacetSelectors(
                        l,
                        selectorCount,
                        selectorSlot,
                        facetCut
                    );
                }
            }

            if (selectorCount != originalSelectorCount) {
                l.selectorCount = uint16(selectorCount);
            }

            // If last selector slot is not full
            if (selectorCount & 7 > 0) {
                l.selectorSlots[selectorCount >> 3] = selectorSlot;
            }

            emit DiamondCut(facetCuts, target, data);
            _initialize(target, data);
        }
    }

    function _addFacetSelectors(
        DiamondBaseStorage.Layout storage l,
        uint256 selectorCount,
        bytes32 selectorSlot,
        FacetCut memory facetCut
    ) internal returns (uint256, bytes32) {
        unchecked {
            if (facetCut.target.isContract()) {
                if (facetCut.target == address(this)) {
                    revert DiamondWritable__SelectorIsImmutable();
                }
            } else if (facetCut.target != address(this)) {
                revert DiamondWritable__TargetHasNoCode();
            }

            for (uint256 i; i < facetCut.selectors.length; i++) {
                bytes4 selector = facetCut.selectors[i];
                bytes32 oldFacet = l.facets[selector];

                if (address(bytes20(oldFacet)) != address(0))
                    revert DiamondWritable__SelectorAlreadyAdded();

                // add facet for selector
                l.facets[selector] =
                    bytes20(facetCut.target) |
                    bytes32(selectorCount);
                uint256 selectorInSlotPosition = (selectorCount & 7) << 5;

                // clear selector position in slot and add selector
                selectorSlot =
                    (selectorSlot &
                        ~(CLEAR_SELECTOR_MASK >> selectorInSlotPosition)) |
                    (bytes32(selector) >> selectorInSlotPosition);

                // if slot is full then write it to storage
                if (selectorInSlotPosition == 224) {
                    l.selectorSlots[selectorCount >> 3] = selectorSlot;
                    selectorSlot = 0;
                }

                selectorCount++;
            }

            return (selectorCount, selectorSlot);
        }
    }

    function _removeFacetSelectors(
        DiamondBaseStorage.Layout storage l,
        uint256 selectorCount,
        bytes32 selectorSlot,
        FacetCut memory facetCut
    ) internal returns (uint256, bytes32) {
        unchecked {
            if (facetCut.target != address(0))
                revert DiamondWritable__RemoveTargetNotZeroAddress();

            uint256 selectorSlotCount = selectorCount >> 3;
            uint256 selectorInSlotIndex = selectorCount & 7;

            for (uint256 i; i < facetCut.selectors.length; i++) {
                bytes4 selector = facetCut.selectors[i];
                bytes32 oldFacet = l.facets[selector];

                if (address(bytes20(oldFacet)) == address(0))
                    revert DiamondWritable__SelectorNotFound();

                if (address(bytes20(oldFacet)) == address(this))
                    revert DiamondWritable__SelectorIsImmutable();

                if (selectorSlot == 0) {
                    selectorSlotCount--;
                    selectorSlot = l.selectorSlots[selectorSlotCount];
                    selectorInSlotIndex = 7;
                } else {
                    selectorInSlotIndex--;
                }

                bytes4 lastSelector;
                uint256 oldSelectorsSlotCount;
                uint256 oldSelectorInSlotPosition;

                // adding a block here prevents stack too deep error
                {
                    // replace selector with last selector in l.facets
                    lastSelector = bytes4(
                        selectorSlot << (selectorInSlotIndex << 5)
                    );

                    if (lastSelector != selector) {
                        // update last selector slot position info
                        l.facets[lastSelector] =
                            (oldFacet & CLEAR_ADDRESS_MASK) |
                            bytes20(l.facets[lastSelector]);
                    }

                    delete l.facets[selector];
                    uint256 oldSelectorCount = uint16(uint256(oldFacet));
                    oldSelectorsSlotCount = oldSelectorCount >> 3;
                    oldSelectorInSlotPosition = (oldSelectorCount & 7) << 5;
                }

                if (oldSelectorsSlotCount != selectorSlotCount) {
                    bytes32 oldSelectorSlot = l.selectorSlots[
                        oldSelectorsSlotCount
                    ];

                    // clears the selector we are deleting and puts the last selector in its place.
                    oldSelectorSlot =
                        (oldSelectorSlot &
                            ~(CLEAR_SELECTOR_MASK >>
                                oldSelectorInSlotPosition)) |
                        (bytes32(lastSelector) >> oldSelectorInSlotPosition);

                    // update storage with the modified slot
                    l.selectorSlots[oldSelectorsSlotCount] = oldSelectorSlot;
                } else {
                    // clears the selector we are deleting and puts the last selector in its place.
                    selectorSlot =
                        (selectorSlot &
                            ~(CLEAR_SELECTOR_MASK >>
                                oldSelectorInSlotPosition)) |
                        (bytes32(lastSelector) >> oldSelectorInSlotPosition);
                }

                if (selectorInSlotIndex == 0) {
                    delete l.selectorSlots[selectorSlotCount];
                    selectorSlot = 0;
                }
            }

            selectorCount = (selectorSlotCount << 3) | selectorInSlotIndex;

            return (selectorCount, selectorSlot);
        }
    }

    function _replaceFacetSelectors(
        DiamondBaseStorage.Layout storage l,
        FacetCut memory facetCut
    ) internal {
        unchecked {
            if (!facetCut.target.isContract())
                revert DiamondWritable__TargetHasNoCode();

            for (uint256 i; i < facetCut.selectors.length; i++) {
                bytes4 selector = facetCut.selectors[i];
                bytes32 oldFacet = l.facets[selector];
                address oldFacetAddress = address(bytes20(oldFacet));

                if (oldFacetAddress == address(0))
                    revert DiamondWritable__SelectorNotFound();
                if (oldFacetAddress == address(this))
                    revert DiamondWritable__SelectorIsImmutable();
                if (oldFacetAddress == facetCut.target)
                    revert DiamondWritable__ReplaceTargetIsIdentical();

                // replace old facet address
                l.facets[selector] =
                    (oldFacet & CLEAR_ADDRESS_MASK) |
                    bytes20(facetCut.target);
            }
        }
    }

    function _initialize(address target, bytes memory data) private {
        if ((target == address(0)) != (data.length == 0))
            revert DiamondWritable__InvalidInitializationParameters();

        if (target != address(0)) {
            if (target != address(this)) {
                if (!target.isContract())
                    revert DiamondWritable__TargetHasNoCode();
            }

            (bool success, ) = target.delegatecall(data);

            if (!success) {
                assembly {
                    returndatacopy(0, 0, returndatasize())
                    revert(0, returndatasize())
                }
            }
        }
    }
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/proxy/diamond/writable/DiamondWritable.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
/**
 * @title EIP-2535 "Diamond" proxy update contract
 */
abstract contract DiamondWritable is
    IDiamondWritable,
    DiamondWritableInternal,
    OwnableInternal
{
    /**
     * @inheritdoc IERC2535DiamondCut
     */
    function diamondCut(
        FacetCut[] calldata facetCuts,
        address target,
        bytes calldata data
    ) external onlyOwner {
        _diamondCut(facetCuts, target, data);
    }
}


// File code/build/DokaBuild/static/sol/src/non-native/solidstate-v0.8.24/proxy/diamond/SolidStateDiamond.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
/**
 * @title SolidState "Diamond" proxy reference implementation
 */
abstract contract SolidStateDiamond is
    ISolidStateDiamond,
    DiamondBase,
    DiamondFallback,
    DiamondReadable,
    DiamondWritable,
    SafeOwnable,
    ERC165Base
{
    constructor() {
        bytes4[] memory selectors = new bytes4[](12);
        uint256 selectorIndex;

        // register DiamondFallback

        selectors[selectorIndex++] = IDiamondFallback
            .getFallbackAddress
            .selector;
        selectors[selectorIndex++] = IDiamondFallback
            .setFallbackAddress
            .selector;

        _setSupportsInterface(type(IDiamondFallback).interfaceId, true);

        // register DiamondWritable

        selectors[selectorIndex++] = IERC2535DiamondCut.diamondCut.selector;

        _setSupportsInterface(type(IERC2535DiamondCut).interfaceId, true);

        // register DiamondReadable

        selectors[selectorIndex++] = IERC2535DiamondLoupe.facets.selector;
        selectors[selectorIndex++] = IERC2535DiamondLoupe
            .facetFunctionSelectors
            .selector;
        selectors[selectorIndex++] = IERC2535DiamondLoupe
            .facetAddresses
            .selector;
        selectors[selectorIndex++] = IERC2535DiamondLoupe.facetAddress.selector;

        _setSupportsInterface(type(IERC2535DiamondLoupe).interfaceId, true);

        // register ERC165

        selectors[selectorIndex++] = IERC165.supportsInterface.selector;

        _setSupportsInterface(type(IERC165).interfaceId, true);

        // register SafeOwnable

        selectors[selectorIndex++] = Ownable.owner.selector;
        selectors[selectorIndex++] = SafeOwnable.nomineeOwner.selector;
        selectors[selectorIndex++] = Ownable.transferOwnership.selector;
        selectors[selectorIndex++] = SafeOwnable.acceptOwnership.selector;

        _setSupportsInterface(type(IERC173).interfaceId, true);

        // diamond cut

        FacetCut[] memory facetCuts = new FacetCut[](1);

        facetCuts[0] = FacetCut({
            target: address(this),
            action: FacetCutAction.ADD,
            selectors: selectors
        });

        _diamondCut(facetCuts, address(0), '');

        // set owner

        _setOwner(msg.sender);
    }

    receive() external payable {}

    function _transferOwnership(
        address account
    ) internal virtual override(OwnableInternal, SafeOwnable) {
        super._transferOwnership(account);
    }

    /**
     * @inheritdoc DiamondFallback
     */
    function _getImplementation()
        internal
        view
        override(DiamondBase, DiamondFallback)
        returns (address implementation)
    {
        implementation = super._getImplementation();
    }
}


// File code/build/DokaBuild/static/sol/src/native/solidstate/Diamond.sol

// Original license: SPDX_License_Identifier: Apache-2.0
pragma solidity ^0.8.19;
contract Chrysalis is SolidStateDiamond {
    function install(address facet) external virtual onlyOwner() returns (bool) {
        return install_(facet);
    }

    function reinstall(address facet) external virtual onlyOwner() returns (bool) {
        return reinstall_(facet);
    }

    function uninstall(address facet) external virtual onlyOwner() returns (bool) {
        return uninstall_(facet);
    }

    function replaceSelectors(address facet, bytes4[] memory selectors) external virtual onlyOwner() returns (bool) {
        return replaceSelectors_(facet, selectors);
    }

    function pushSelectors(address facet, bytes4[] memory selectors) external virtual onlyOwner() returns (bool) {
        return pushSelectors_(facet, selectors);
    }

    function pullSelectors(bytes4[] memory selectors) external virtual onlyOwner() returns (bool) {
        return pullSelectors_(selectors);
    }

    function install_(address facet) private returns (bool) {
        IFacet facetInterface = IFacet(facet);
        bytes4[] memory selectors = facetInterface.selectors();
        return pushSelectors_(facet, selectors);
    }

    function reinstall_(address facet) private returns (bool) {
        IFacet facetInterface = IFacet(facet);
        bytes4[] memory selectors = facetInterface.selectors();
        return replaceSelectors_(facet, selectors);
    }

    function uninstall_(address facet) private returns (bool) {
        IFacet facetInterface = IFacet(facet);
        bytes4[] memory selectors = facetInterface.selectors();
        return pullSelectors_(selectors);
    }

    function replaceSelectors_(address facet, bytes4[] memory selectors) private returns (bool) {
        FacetCutAction action = FacetCutAction.REPLACE;
        FacetCut memory facetCut;
        facetCut.target = facet;
        facetCut.action = action;
        facetCut.selectors = selectors;
        FacetCut[] memory facetCuts = new FacetCut[](1);
        facetCuts[0] = facetCut;
        address noAddress;
        bytes memory noBytes;
        _diamondCut(facetCuts, noAddress, noBytes);
        return true;
    }

    function pushSelectors_(address facet, bytes4[] memory selectors) private returns (bool) {
        FacetCutAction action = FacetCutAction.ADD;
        FacetCut memory facetCut;
        facetCut.target = facet;
        facetCut.action = action;
        facetCut.selectors = selectors;
        FacetCut[] memory facetCuts = new FacetCut[](1);
        facetCuts[0] = facetCut;
        address noAddress;
        bytes memory noBytes;
        _diamondCut(facetCuts, noAddress, noBytes);
        return true;
    }

    function pullSelectors_(bytes4[] memory selectors) private returns (bool) {
        FacetCutAction action = FacetCutAction.REMOVE;
        FacetCut memory facetCut;
        address noAddress;
        bytes memory noBytes;
        facetCut.target = noAddress;
        facetCut.action = action;
        facetCut.selectors = selectors;
        FacetCut[] memory facetCuts = new FacetCut[](1);
        facetCuts[0] = facetCut;
        _diamondCut(facetCuts, noAddress, noBytes);
        return true;
    }
}
