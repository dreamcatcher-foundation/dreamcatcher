

// Sources flattened with hardhat v2.21.0 https://hardhat.org

// SPDX-License-Identifier: Apache-2.0 AND MIT

// File src/app/atlas/sol/class/kernel/adminNode/AdminNodeSlot.sol

// Original license: SPDX_License_Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct Node {
    address node;
    address owner;
}

struct AdminNodeSlotStorageLayout {
    mapping(string => Node) nodes;
}

contract AdminNodeSlot {
    bytes32 constant internal _NODE_ADMIN_SLOT = bytes32(
        uint256(
            keccak256(
                "eip1976.nodeAdmin"
            )
        ) - 1
    );

    function _children() internal pure returns (mapping(string => Node) storage storageLayout) {
        bytes32 location = _NODE_ADMIN_SLOT;
        assembly {
            storageLayout.slot := location
        }
    }
}


// File src/app/atlas/sol/class/kernel/router/RouterSlot.sol

// Original license: SPDX_License_Identifier: Apache-2.0
pragma solidity >=0.8.19;

contract RouterSlot {
    bytes32 constant internal _ROUTER_SLOT = bytes32(
        uint256(
            keccak256(
                "eip1976.router"
            )
        ) - 1
    );

    function _versions() internal pure returns (mapping(string => address[]) storage storageLayout) {
        bytes32 location = _ROUTER_SLOT;
        assembly {
            storageLayout.slot := location
        }
    }
}


// File src/app/atlas/sol/class/kernel/router/RouterSdk.sol

// Original license: SPDX_License_Identifier: Apache-2.0
pragma solidity >=0.8.19;
contract RouterSdk is RouterSlot {
    function _versionsOf(string memory key, uint256 version) internal view returns (address) {
        return _versions()[key][version];
    }

    function _versionsOf(string memory key) internal view returns (address[] memory) {
        return _versionsOf(key);
    }

    function _versionsLengthOf(string memory key) internal view returns (uint256) {
        return _versions()[key].length;
    }

    function _latestVersionOf(string memory key) internal view returns (address) {
        return _versions()[key][_versionsLengthOf(key) - 1];
    }

    function _commit(string memory key, address implementation) internal returns (bool) {
        _versions()[key].push(implementation);
        return true;
    }
}


// File src/app/atlas/sol/deployer/IDeployer.sol

// Original license: SPDX_License_Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IDeployer {
    event Deployment(address);

    function deploy() external returns (address);
}


// File src/app/atlas/sol/deployer/INodeDeployer.sol

// Original license: SPDX_License_Identifier: Apache-2.0
pragma solidity >=0.8.19;
interface INodeDeployer is IDeployer {
    function owner() external view returns (address);
    function renounceOwnership() external;
    function transferOwnership(address account) external;
}


// File src/app/atlas/sol/import/solidstate-v0.8.24/interfaces/IERC173Internal.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;

/**
 * @title Partial ERC173 interface needed by internal functions
 */
interface IERC173Internal {
    event OwnershipTransferred(
        address indexed oldOwner,
        address indexed newOwner
    );
}


// File src/app/atlas/sol/import/solidstate-v0.8.24/access/ownable/IOwnableInternal.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
interface IOwnableInternal is IERC173Internal {
    error Ownable__NotOwner();
    error Ownable__NotTransitiveOwner();
}


// File src/app/atlas/sol/import/solidstate-v0.8.24/interfaces/IERC173.sol

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


// File src/app/atlas/sol/import/solidstate-v0.8.24/access/ownable/IOwnable.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
interface IOwnable is IOwnableInternal, IERC173 {}


// File src/app/atlas/sol/import/solidstate-v0.8.24/access/ownable/ISafeOwnableInternal.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
interface ISafeOwnableInternal is IOwnableInternal {
    error SafeOwnable__NotNomineeOwner();
}


// File src/app/atlas/sol/import/solidstate-v0.8.24/access/ownable/ISafeOwnable.sol

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


// File src/app/atlas/sol/import/solidstate-v0.8.24/interfaces/IERC165Internal.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;

/**
 * @title ERC165 interface registration interface
 */
interface IERC165Internal {

}


// File src/app/atlas/sol/import/solidstate-v0.8.24/interfaces/IERC165.sol

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


// File src/app/atlas/sol/import/solidstate-v0.8.24/proxy/IProxy.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;

interface IProxy {
    error Proxy__ImplementationIsNotContract();

    fallback() external payable;
}


// File src/app/atlas/sol/import/solidstate-v0.8.24/proxy/diamond/base/IDiamondBase.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
interface IDiamondBase is IProxy {}


// File src/app/atlas/sol/import/solidstate-v0.8.24/proxy/diamond/fallback/IDiamondFallback.sol

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


// File src/app/atlas/sol/import/solidstate-v0.8.24/interfaces/IERC2535DiamondLoupeInternal.sol

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


// File src/app/atlas/sol/import/solidstate-v0.8.24/interfaces/IERC2535DiamondLoupe.sol

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


// File src/app/atlas/sol/import/solidstate-v0.8.24/proxy/diamond/readable/IDiamondReadableInternal.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
/**
 * @title Diamond proxy introspection interface needed for internal functions
 * @dev see https://eips.ethereum.org/EIPS/eip-2535
 */
interface IDiamondReadableInternal is IERC2535DiamondLoupeInternal {

}


// File src/app/atlas/sol/import/solidstate-v0.8.24/proxy/diamond/readable/IDiamondReadable.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
/**
 * @title Diamond proxy introspection interface
 * @dev see https://eips.ethereum.org/EIPS/eip-2535
 */
interface IDiamondReadable is IERC2535DiamondLoupe, IDiamondReadableInternal {

}


// File src/app/atlas/sol/import/solidstate-v0.8.24/interfaces/IERC2535DiamondCutInternal.sol

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


// File src/app/atlas/sol/import/solidstate-v0.8.24/interfaces/IERC2535DiamondCut.sol

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


// File src/app/atlas/sol/import/solidstate-v0.8.24/proxy/diamond/writable/IDiamondWritableInternal.sol

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


// File src/app/atlas/sol/import/solidstate-v0.8.24/proxy/diamond/writable/IDiamondWritable.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.18;
/**
 * @title Diamond proxy upgrade interface
 * @dev see https://eips.ethereum.org/EIPS/eip-2535
 */
interface IDiamondWritable is IERC2535DiamondCut, IDiamondWritableInternal {

}


// File src/app/atlas/sol/import/solidstate-v0.8.24/proxy/diamond/ISolidStateDiamond.sol

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


// File src/app/atlas/sol/INode.sol

// Original license: SPDX_License_Identifier: Apache-2.0
pragma solidity >=0.8.19;
/**
*    facetAddress
*    facetAddresses
*    facetFunctionSelectors
*    facets
*    getFallbackAddress
*    nomineeOwner
*    owner
*    supportsInterface
*
*    acceptOwnership
*    diamondCut
*    install
*    pullSelectors
*    pushSelectors
*    reinstall
*    replaceSelectors
*    setFallbackAddress
*    transferOwnership
*    uninstall
 */
interface INode is ISolidStateDiamond {
    function install(address plugIn) external returns (bool);
    function reinstall(address plugIn) external returns (bool);
    function uninstall(address plugIn) external returns (bool);
    function replaceSelectors(address plugIn, bytes4[] memory selectors) external returns (bool);
    function pushSelectors(address plugIn, bytes4[] memory selectors) external returns (bool);
    function pullSelectors(bytes4[] memory selectors) external returns (bool);   
}


// File src/app/atlas/sol/class/kernel/adminNode/AdminNodeSdk.sol

// Original license: SPDX_License_Identifier: Apache-2.0
pragma solidity >=0.8.19;
contract AdminNodeSdk is
    AdminNodeSlot,
    RouterSdk {
    error DaoNameIsAlreadyInUse();
    error Unauthorized();

    function _deploy(string memory daoName) internal returns (address) {
        if (_children()[daoName].node != address(0)) {
            revert DaoNameIsAlreadyInUse();
        }
        INodeDeployer deployer = INodeDeployer(_latestVersionOf("NodeDeployer"));
        INode node = INode(payable(deployer.deploy()));
        node.install(_latestVersionOf("AuthFacet"));
        _children()[daoName].node = address(node);
        _children()[daoName].owner = msg.sender;
        return _children()[daoName].node;
    }

    function _installFor(string memory daoName, string memory plugInName) internal returns (bool) {
        if (_children()[daoName].owner != msg.sender) {
            revert Unauthorized();
        }
        INode(payable(_children()[daoName].node)).install(_latestVersionOf(plugInName));
        return true;
    }

    function _uninstallFor(string memory daoName, string memory plugInName) internal returns (bool) {
        if (_children()[daoName].owner != msg.sender) {
            revert Unauthorized();
        }
        INode(payable(_children()[daoName].node)).uninstall(_latestVersionOf(plugInName));
        return true;
    }
}


// File src/app/atlas/sol/class/kernel/adminNode/IAdminNodePlugIn.sol

// Original license: SPDX_License_Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IAdminNodePlugIn {
    function deploy(string memory daoName) external returns (address);
    function installFor(string memory daoName, string memory plugInName) external returns (bool);
    function uninstallFor(string memory daoName, string memory plugInName) external returns (bool);
}


// File src/app/atlas/sol/IPlugIn.sol

// Original license: SPDX_License_Identifier: Apache-2.0
pragma solidity >=0.8.19;

interface IPlugIn {
    function selectors() external pure returns (bytes4[] memory);
}


// File src/app/atlas/sol/class/kernel/adminNode/AdminNodePlugIn.sol

// Original license: SPDX_License_Identifier: Apache-2.0
pragma solidity >=0.8.19;
contract AdminNodePlugIn is 
    IPlugIn,
    IAdminNodePlugIn,
    AdminNodeSdk {
    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](3);
        selectors[0] = bytes4(keccak256("deploy(string)"));
        selectors[1] = bytes4(keccak256("installFor(string,string)"));
        selectors[2] = bytes4(keccak256("uninstallFor(string,string)"));
        return selectors;
    }

    function deploy(string memory daoName) external returns (address) {
        return _deploy(daoName);
    }

    function installFor(string memory daoName, string memory plugInName) external returns (bool) {
        return _installFor(daoName, plugInName);
    }

    function uninstallFor(string memory daoName, string memory plugInName) external returns (bool) {
        return _uninstallFor(daoName, plugInName);
    }
}
