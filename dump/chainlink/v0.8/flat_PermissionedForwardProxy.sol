
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\PermissionedForwardProxy.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

interface OwnableInterface {
  function owner() external returns (address);

  function transferOwnership(address recipient) external;

  function acceptOwnership() external;
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\PermissionedForwardProxy.sol
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
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\PermissionedForwardProxy.sol
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
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\PermissionedForwardProxy.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity 0.8.6;

////import "@openzeppelin/contracts/utils/Address.sol";
////import "./ConfirmedOwner.sol";

/**
 * @title PermissionedForwardProxy
 * @notice This proxy is used to forward calls from sender to target. It maintains
 * a permission list to check which sender is allowed to call which target
 */
contract PermissionedForwardProxy is ConfirmedOwner {
  using Address for address;

  error PermissionNotSet();

  event PermissionSet(address indexed sender, address target);
  event PermissionRemoved(address indexed sender);

  mapping(address => address) private s_forwardPermissionList;

  constructor() ConfirmedOwner(msg.sender) {}

  /**
   * @notice Verifies if msg.sender has permission to forward to target address and then forwards the handler
   * @param target address of the contract to forward the handler to
   * @param handler bytes to be passed to target in call data
   */
  function forward(address target, bytes calldata handler) external {
    if (s_forwardPermissionList[msg.sender] != target) {
      revert PermissionNotSet();
    }
    target.functionCall(handler);
  }

  /**
   * @notice Adds permission for sender to forward calls to target via this proxy.
   * Note that it allows to overwrite an existing permission
   * @param sender The address who will use this proxy to forward calls
   * @param target The address where sender will be allowed to forward calls
   */
  function setPermission(address sender, address target) external onlyOwner {
    s_forwardPermissionList[sender] = target;

    emit PermissionSet(sender, target);
  }

  /**
   * @notice Removes permission for sender to forward calls via this proxy
   * @param sender The address who will use this proxy to forward calls
   */
  function removePermission(address sender) external onlyOwner {
    delete s_forwardPermissionList[sender];

    emit PermissionRemoved(sender);
  }

  /**
   * @notice Returns the target address that the sender can use this proxy for
   * @param sender The address to fetch the permissioned target for
   */
  function getPermission(address sender) external view returns (address) {
    return s_forwardPermissionList[sender];
  }
}

