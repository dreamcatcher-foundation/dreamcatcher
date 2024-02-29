
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\CrossDomainDelegateForwarder.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

interface OwnableInterface {
  function owner() external returns (address);

  function transferOwnership(address recipient) external;

  function acceptOwnership() external;
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\CrossDomainDelegateForwarder.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

////import "./interfaces/OwnableInterface.sol";

/**
 * @title The ConfirmedOwner contract
 * @notice A contract with helpers for basic contract ownership.
 */
contract ConfirmedOwnerWithProposal is OwnableInterface {
  address private s_owner;
  address private s_pendingOwner;

  event OwnershipTransferRequested(address indexed from, address indexed to);
  event OwnershipTransferred(address indexed from, address indexed to);

  constructor(address newOwner, address pendingOwner) {
    require(newOwner != address(0), "Cannot set owner to zero");

    s_owner = newOwner;
    if (pendingOwner != address(0)) {
      _transferOwnership(pendingOwner);
    }
  }

  /**
   * @notice Allows an owner to begin transferring ownership to a new address,
   * pending.
   */
  function transferOwnership(address to) public override onlyOwner {
    _transferOwnership(to);
  }

  /**
   * @notice Allows an ownership transfer to be completed by the recipient.
   */
  function acceptOwnership() external override {
    require(msg.sender == s_pendingOwner, "Must be proposed owner");

    address oldOwner = s_owner;
    s_owner = msg.sender;
    s_pendingOwner = address(0);

    emit OwnershipTransferred(oldOwner, msg.sender);
  }

  /**
   * @notice Get the current owner
   */
  function owner() public view override returns (address) {
    return s_owner;
  }

  /**
   * @notice validate, transfer ownership, and emit relevant events
   */
  function _transferOwnership(address to) private {
    require(to != msg.sender, "Cannot transfer to self");

    s_pendingOwner = to;

    emit OwnershipTransferRequested(s_owner, to);
  }

  /**
   * @notice validate access
   */
  function _validateOwnership() internal view {
    require(msg.sender == s_owner, "Only callable by owner");
  }

  /**
   * @notice Reverts if called by anyone other than the contract owner.
   */
  modifier onlyOwner() {
    _validateOwnership();
    _;
  }
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\CrossDomainDelegateForwarder.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

/// @title CrossDomainOwnableInterface - A contract with helpers for cross-domain contract ownership
interface CrossDomainOwnableInterface {
  event L1OwnershipTransferRequested(address indexed from, address indexed to);

  event L1OwnershipTransferred(address indexed from, address indexed to);

  function l1Owner() external returns (address);

  function transferL1Ownership(address recipient) external;

  function acceptL1Ownership() external;
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\CrossDomainDelegateForwarder.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

////import "./ConfirmedOwnerWithProposal.sol";

/**
 * @title The ConfirmedOwner contract
 * @notice A contract with helpers for basic contract ownership.
 */
contract ConfirmedOwner is ConfirmedOwnerWithProposal {
  constructor(address newOwner) ConfirmedOwnerWithProposal(newOwner, address(0)) {}
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\CrossDomainDelegateForwarder.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

/// @title ForwarderInterface - forwards a call to a target, under some conditions
interface ForwarderInterface {
  /**
   * @notice forward calls the `target` with `data`
   * @param target contract address to be called
   * @param data to send to target contract
   */
  function forward(address target, bytes memory data) external;
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\CrossDomainDelegateForwarder.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

////import "../ConfirmedOwner.sol";
////import "./interfaces/CrossDomainOwnableInterface.sol";

/**
 * @title The CrossDomainOwnable contract
 * @notice A contract with helpers for cross-domain contract ownership.
 */
contract CrossDomainOwnable is CrossDomainOwnableInterface, ConfirmedOwner {
  address internal s_l1Owner;
  address internal s_l1PendingOwner;

  constructor(address newl1Owner) ConfirmedOwner(msg.sender) {
    _setL1Owner(newl1Owner);
  }

  /**
   * @notice transfer ownership of this account to a new L1 owner
   * @param to new L1 owner that will be allowed to call the forward fn
   */
  function transferL1Ownership(address to) public virtual override onlyL1Owner {
    _transferL1Ownership(to);
  }

  /**
   * @notice accept ownership of this account to a new L1 owner
   */
  function acceptL1Ownership() public virtual override onlyProposedL1Owner {
    _setL1Owner(s_l1PendingOwner);
  }

  /**
   * @notice Get the current owner
   */
  function l1Owner() public view override returns (address) {
    return s_l1Owner;
  }

  /**
   * @notice validate, transfer ownership, and emit relevant events
   */
  function _transferL1Ownership(address to) internal {
    require(to != msg.sender, "Cannot transfer to self");

    s_l1PendingOwner = to;

    emit L1OwnershipTransferRequested(s_l1Owner, to);
  }

  /**
   * @notice set ownership, emit relevant events. Used in acceptOwnership()
   */
  function _setL1Owner(address to) internal {
    address oldOwner = s_l1Owner;
    s_l1Owner = to;
    s_l1PendingOwner = address(0);

    emit L1OwnershipTransferred(oldOwner, to);
  }

  /**
   * @notice Reverts if called by anyone other than the L1 owner.
   */
  modifier onlyL1Owner() virtual {
    require(msg.sender == s_l1Owner, "Only callable by L1 owner");
    _;
  }

  /**
   * @notice Reverts if called by anyone other than the L1 owner.
   */
  modifier onlyProposedL1Owner() virtual {
    require(msg.sender == s_l1PendingOwner, "Only callable by proposed L1 owner");
    _;
  }
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\CrossDomainDelegateForwarder.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

/// @title DelegateForwarderInterface - forwards a delegatecall to a target, under some conditions
interface DelegateForwarderInterface {
  /**
   * @notice forward delegatecalls the `target` with `data`
   * @param target contract address to be delegatecalled
   * @param data to send to target contract
   */
  function forwardDelegate(address target, bytes memory data) external;
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\CrossDomainDelegateForwarder.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

////import "./CrossDomainOwnable.sol";
////import "./interfaces/ForwarderInterface.sol";

/**
 * @title CrossDomainForwarder - L1 xDomain account representation
 * @notice L2 Contract which receives messages from a specific L1 address and transparently forwards them to the destination.
 * @dev Any other L2 contract which uses this contract's address as a privileged position,
 *   can consider that position to be held by the `l1Owner`
 */
abstract contract CrossDomainForwarder is ForwarderInterface, CrossDomainOwnable {

}


/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\CrossDomainDelegateForwarder.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

////import "./CrossDomainForwarder.sol";
////import "./interfaces/ForwarderInterface.sol";
////import "./interfaces/DelegateForwarderInterface.sol";

/**
 * @title CrossDomainDelegateForwarder - L1 xDomain account representation (with delegatecall support)
 * @notice L2 Contract which receives messages from a specific L1 address and transparently forwards them to the destination.
 * @dev Any other L2 contract which uses this contract's address as a privileged position,
 *   can consider that position to be held by the `l1Owner`
 */
abstract contract CrossDomainDelegateForwarder is DelegateForwarderInterface, CrossDomainOwnable {

}

