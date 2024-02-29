
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\Flags.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

interface OwnableInterface {
  function owner() external returns (address);

  function transferOwnership(address recipient) external;

  function acceptOwnership() external;
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\Flags.sol
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
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\Flags.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

interface AccessControllerInterface {
  function hasAccess(address user, bytes calldata data) external view returns (bool);
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\Flags.sol
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
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\Flags.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

////import "./ConfirmedOwner.sol";
////import "./interfaces/AccessControllerInterface.sol";

/**
 * @title SimpleWriteAccessController
 * @notice Gives access to accounts explicitly added to an access list by the
 * controller's owner.
 * @dev does not make any special permissions for externally, see
 * SimpleReadAccessController for that.
 */
contract SimpleWriteAccessController is AccessControllerInterface, ConfirmedOwner {
  bool public checkEnabled;
  mapping(address => bool) internal accessList;

  event AddedAccess(address user);
  event RemovedAccess(address user);
  event CheckAccessEnabled();
  event CheckAccessDisabled();

  constructor() ConfirmedOwner(msg.sender) {
    checkEnabled = true;
  }

  /**
   * @notice Returns the access of an address
   * @param _user The address to query
   */
  function hasAccess(address _user, bytes memory) public view virtual override returns (bool) {
    return accessList[_user] || !checkEnabled;
  }

  /**
   * @notice Adds an address to the access list
   * @param _user The address to add
   */
  function addAccess(address _user) external onlyOwner {
    if (!accessList[_user]) {
      accessList[_user] = true;

      emit AddedAccess(_user);
    }
  }

  /**
   * @notice Removes an address from the access list
   * @param _user The address to remove
   */
  function removeAccess(address _user) external onlyOwner {
    if (accessList[_user]) {
      accessList[_user] = false;

      emit RemovedAccess(_user);
    }
  }

  /**
   * @notice makes the access check enforced
   */
  function enableAccessCheck() external onlyOwner {
    if (!checkEnabled) {
      checkEnabled = true;

      emit CheckAccessEnabled();
    }
  }

  /**
   * @notice makes the access check unenforced
   */
  function disableAccessCheck() external onlyOwner {
    if (checkEnabled) {
      checkEnabled = false;

      emit CheckAccessDisabled();
    }
  }

  /**
   * @dev reverts if the caller does not have access
   */
  modifier checkAccess() {
    require(hasAccess(msg.sender, msg.data), "No access");
    _;
  }
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\Flags.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.6;

interface FlagsInterface {
  function getFlag(address) external view returns (bool);

  function getFlags(address[] calldata) external view returns (bool[] memory);

  function raiseFlag(address) external;

  function raiseFlags(address[] calldata) external;

  function lowerFlag(address) external;

  function lowerFlags(address[] calldata) external;

  function setRaisingAccessController(address) external;

  function setLoweringAccessController(address) external;
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\Flags.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

abstract contract TypeAndVersionInterface {
  function typeAndVersion() external pure virtual returns (string memory);
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\Flags.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

////import "./SimpleWriteAccessController.sol";

/**
 * @title SimpleReadAccessController
 * @notice Gives access to:
 * - any externally owned account (note that off-chain actors can always read
 * any contract storage regardless of on-chain access control measures, so this
 * does not weaken the access control while improving usability)
 * - accounts explicitly added to an access list
 * @dev SimpleReadAccessController is not suitable for access controlling writes
 * since it grants any externally owned account access! See
 * SimpleWriteAccessController for that.
 */
contract SimpleReadAccessController is SimpleWriteAccessController {
  /**
   * @notice Returns the access of an address
   * @param _user The address to query
   */
  function hasAccess(address _user, bytes memory _calldata) public view virtual override returns (bool) {
    return super.hasAccess(_user, _calldata) || _user == tx.origin;
  }
}


/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\Flags.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.6;

////import "../SimpleReadAccessController.sol";
////import "../interfaces/AccessControllerInterface.sol";
////import "../interfaces/TypeAndVersionInterface.sol";

/* dev dependencies - to be re/moved after audit */
////import "./interfaces/FlagsInterface.sol";

/**
 * @title The Flags contract
 * @notice Allows flags to signal to any reader on the access control list.
 * The owner can set flags, or designate other addresses to set flags.
 * Raise flag actions are controlled by its own access controller.
 * Lower flag actions are controlled by its own access controller.
 * An expected pattern is to allow addresses to raise flags on themselves, so if you are subscribing to
 * FlagOn events you should filter for addresses you care about.
 */
contract Flags is TypeAndVersionInterface, FlagsInterface, SimpleReadAccessController {
  AccessControllerInterface public raisingAccessController;
  AccessControllerInterface public loweringAccessController;

  mapping(address => bool) private flags;

  event FlagRaised(address indexed subject);
  event FlagLowered(address indexed subject);
  event RaisingAccessControllerUpdated(address indexed previous, address indexed current);
  event LoweringAccessControllerUpdated(address indexed previous, address indexed current);

  /**
   * @param racAddress address for the raising access controller.
   * @param lacAddress address for the lowering access controller.
   */
  constructor(address racAddress, address lacAddress) {
    setRaisingAccessController(racAddress);
    setLoweringAccessController(lacAddress);
  }

  /**
   * @notice versions:
   *
   * - Flags 1.1.0: upgraded to solc 0.8, added lowering access controller
   * - Flags 1.0.0: initial release
   *
   * @inheritdoc TypeAndVersionInterface
   */
  function typeAndVersion() external pure virtual override returns (string memory) {
    return "Flags 1.1.0";
  }

  /**
   * @notice read the warning flag status of a contract address.
   * @param subject The contract address being checked for a flag.
   * @return A true value indicates that a flag was raised and a
   * false value indicates that no flag was raised.
   */
  function getFlag(address subject) external view override checkAccess returns (bool) {
    return flags[subject];
  }

  /**
   * @notice read the warning flag status of a contract address.
   * @param subjects An array of addresses being checked for a flag.
   * @return An array of bools where a true value for any flag indicates that
   * a flag was raised and a false value indicates that no flag was raised.
   */
  function getFlags(address[] calldata subjects) external view override checkAccess returns (bool[] memory) {
    bool[] memory responses = new bool[](subjects.length);
    for (uint256 i = 0; i < subjects.length; i++) {
      responses[i] = flags[subjects[i]];
    }
    return responses;
  }

  /**
   * @notice enable the warning flag for an address.
   * Access is controlled by raisingAccessController, except for owner
   * who always has access.
   * @param subject The contract address whose flag is being raised
   */
  function raiseFlag(address subject) external override {
    require(_allowedToRaiseFlags(), "Not allowed to raise flags");

    _tryToRaiseFlag(subject);
  }

  /**
   * @notice enable the warning flags for multiple addresses.
   * Access is controlled by raisingAccessController, except for owner
   * who always has access.
   * @param subjects List of the contract addresses whose flag is being raised
   */
  function raiseFlags(address[] calldata subjects) external override {
    require(_allowedToRaiseFlags(), "Not allowed to raise flags");

    for (uint256 i = 0; i < subjects.length; i++) {
      _tryToRaiseFlag(subjects[i]);
    }
  }

  /**
   * @notice allows owner to disable the warning flags for an addresses.
   * Access is controlled by loweringAccessController, except for owner
   * who always has access.
   * @param subject The contract address whose flag is being lowered
   */
  function lowerFlag(address subject) external override {
    require(_allowedToLowerFlags(), "Not allowed to lower flags");

    _tryToLowerFlag(subject);
  }

  /**
   * @notice allows owner to disable the warning flags for multiple addresses.
   * Access is controlled by loweringAccessController, except for owner
   * who always has access.
   * @param subjects List of the contract addresses whose flag is being lowered
   */
  function lowerFlags(address[] calldata subjects) external override {
    require(_allowedToLowerFlags(), "Not allowed to lower flags");

    for (uint256 i = 0; i < subjects.length; i++) {
      address subject = subjects[i];

      _tryToLowerFlag(subject);
    }
  }

  /**
   * @notice allows owner to change the access controller for raising flags.
   * @param racAddress new address for the raising access controller.
   */
  function setRaisingAccessController(address racAddress) public override onlyOwner {
    address previous = address(raisingAccessController);

    if (previous != racAddress) {
      raisingAccessController = AccessControllerInterface(racAddress);

      emit RaisingAccessControllerUpdated(previous, racAddress);
    }
  }

  function setLoweringAccessController(address lacAddress) public override onlyOwner {
    address previous = address(loweringAccessController);

    if (previous != lacAddress) {
      loweringAccessController = AccessControllerInterface(lacAddress);

      emit LoweringAccessControllerUpdated(previous, lacAddress);
    }
  }

  // PRIVATE
  function _allowedToRaiseFlags() private view returns (bool) {
    return msg.sender == owner() || raisingAccessController.hasAccess(msg.sender, msg.data);
  }

  function _allowedToLowerFlags() private view returns (bool) {
    return msg.sender == owner() || loweringAccessController.hasAccess(msg.sender, msg.data);
  }

  function _tryToRaiseFlag(address subject) private {
    if (!flags[subject]) {
      flags[subject] = true;
      emit FlagRaised(subject);
    }
  }

  function _tryToLowerFlag(address subject) private {
    if (flags[subject]) {
      flags[subject] = false;
      emit FlagLowered(subject);
    }
  }
}

