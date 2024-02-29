
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\OptimismCrossDomainGovernor.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

interface OwnableInterface {
  function owner() external returns (address);

  function transferOwnership(address recipient) external;

  function acceptOwnership() external;
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\OptimismCrossDomainGovernor.sol
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
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\OptimismCrossDomainGovernor.sol
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
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\OptimismCrossDomainGovernor.sol
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
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\OptimismCrossDomainGovernor.sol
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
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\OptimismCrossDomainGovernor.sol
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
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\OptimismCrossDomainGovernor.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT

pragma solidity ^0.8.0;

/**
 * @dev Collection of functions related to the address type
 */
library Address {
  /**
   * @dev Returns true if `account` is a contract.
   *
   * [////IMPORTANT]
   * ====
   * It is unsafe to assume that an address for which this function returns
   * false is an externally-owned account (EOA) and not a contract.
   *
   * Among others, `isContract` will return false for the following
   * types of addresses:
   *
   *  - an externally-owned account
   *  - a contract in construction
   *  - an address where a contract will be created
   *  - an address where a contract lived, but was destroyed
   * ====
   */
  function isContract(address account) internal view returns (bool) {
    // This method relies on extcodesize, which returns 0 for contracts in
    // construction, since the code is only stored at the end of the
    // constructor execution.

    uint256 size;
    assembly {
      size := extcodesize(account)
    }
    return size > 0;
  }

  /**
   * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
   * `recipient`, forwarding all available gas and reverting on errors.
   *
   * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
   * of certain opcodes, possibly making contracts go over the 2300 gas limit
   * imposed by `transfer`, making them unable to receive funds via
   * `transfer`. {sendValue} removes this limitation.
   *
   * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
   *
   * ////IMPORTANT: because control is transferred to `recipient`, care must be
   * taken to not create reentrancy vulnerabilities. Consider using
   * {ReentrancyGuard} or the
   * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
   */
  function sendValue(address payable recipient, uint256 amount) internal {
    require(address(this).balance >= amount, "Address: insufficient balance");

    (bool success, ) = recipient.call{value: amount}("");
    require(success, "Address: unable to send value, recipient may have reverted");
  }

  /**
   * @dev Performs a Solidity function call using a low level `call`. A
   * plain `call` is an unsafe replacement for a function call: use this
   * function instead.
   *
   * If `target` reverts with a revert reason, it is bubbled up by this
   * function (like regular Solidity function calls).
   *
   * Returns the raw returned data. To convert to the expected return value,
   * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
   *
   * Requirements:
   *
   * - `target` must be a contract.
   * - calling `target` with `data` must not revert.
   *
   * _Available since v3.1._
   */
  function functionCall(address target, bytes memory data) internal returns (bytes memory) {
    return functionCall(target, data, "Address: low-level call failed");
  }

  /**
   * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
   * `errorMessage` as a fallback revert reason when `target` reverts.
   *
   * _Available since v3.1._
   */
  function functionCall(
    address target,
    bytes memory data,
    string memory errorMessage
  ) internal returns (bytes memory) {
    return functionCallWithValue(target, data, 0, errorMessage);
  }

  /**
   * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
   * but also transferring `value` wei to `target`.
   *
   * Requirements:
   *
   * - the calling contract must have an ETH balance of at least `value`.
   * - the called Solidity function must be `payable`.
   *
   * _Available since v3.1._
   */
  function functionCallWithValue(
    address target,
    bytes memory data,
    uint256 value
  ) internal returns (bytes memory) {
    return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
  }

  /**
   * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
   * with `errorMessage` as a fallback revert reason when `target` reverts.
   *
   * _Available since v3.1._
   */
  function functionCallWithValue(
    address target,
    bytes memory data,
    uint256 value,
    string memory errorMessage
  ) internal returns (bytes memory) {
    require(address(this).balance >= value, "Address: insufficient balance for call");
    require(isContract(target), "Address: call to non-contract");

    (bool success, bytes memory returndata) = target.call{value: value}(data);
    return verifyCallResult(success, returndata, errorMessage);
  }

  /**
   * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
   * but performing a static call.
   *
   * _Available since v3.3._
   */
  function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
    return functionStaticCall(target, data, "Address: low-level static call failed");
  }

  /**
   * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
   * but performing a static call.
   *
   * _Available since v3.3._
   */
  function functionStaticCall(
    address target,
    bytes memory data,
    string memory errorMessage
  ) internal view returns (bytes memory) {
    require(isContract(target), "Address: static call to non-contract");

    (bool success, bytes memory returndata) = target.staticcall(data);
    return verifyCallResult(success, returndata, errorMessage);
  }

  /**
   * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
   * but performing a delegate call.
   *
   * _Available since v3.4._
   */
  function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
    return functionDelegateCall(target, data, "Address: low-level delegate call failed");
  }

  /**
   * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
   * but performing a delegate call.
   *
   * _Available since v3.4._
   */
  function functionDelegateCall(
    address target,
    bytes memory data,
    string memory errorMessage
  ) internal returns (bytes memory) {
    require(isContract(target), "Address: delegate call to non-contract");

    (bool success, bytes memory returndata) = target.delegatecall(data);
    return verifyCallResult(success, returndata, errorMessage);
  }

  /**
   * @dev Tool to verifies that a low level call was successful, and revert if it wasn't, either by bubbling the
   * revert reason using the provided one.
   *
   * _Available since v4.3._
   */
  function verifyCallResult(
    bool success,
    bytes memory returndata,
    string memory errorMessage
  ) internal pure returns (bytes memory) {
    if (success) {
      return returndata;
    } else {
      // Look for revert reason and bubble it up if present
      if (returndata.length > 0) {
        // The easiest way to bubble the revert reason is using memory via assembly

        assembly {
          let returndata_size := mload(returndata)
          revert(add(32, returndata), returndata_size)
        }
      } else {
        revert(errorMessage);
      }
    }
  }
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\OptimismCrossDomainGovernor.sol
*/
            
pragma solidity >=0.7.6 <0.9.0;

/**
 * @title iOVM_CrossDomainMessenger
 */
interface iOVM_CrossDomainMessenger {
  /**********
   * Events *
   **********/

  event SentMessage(bytes message);
  event RelayedMessage(bytes32 msgHash);
  event FailedRelayedMessage(bytes32 msgHash);

  /*************
   * Variables *
   *************/

  function xDomainMessageSender() external view returns (address);

  /********************
   * Public Functions *
   ********************/

  /**
   * Sends a cross domain message to the target messenger.
   * @param _target Target contract address.
   * @param _message Message to send to the target.
   * @param _gasLimit Gas limit for the provided message.
   */
  function sendMessage(
    address _target,
    bytes calldata _message,
    uint32 _gasLimit
  ) external;
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\OptimismCrossDomainGovernor.sol
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
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\OptimismCrossDomainGovernor.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

abstract contract TypeAndVersionInterface {
  function typeAndVersion() external pure virtual returns (string memory);
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\OptimismCrossDomainGovernor.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

////import "../interfaces/TypeAndVersionInterface.sol";

/* ./dev dependencies - to be moved from ./dev after audit */
////import "./CrossDomainForwarder.sol";
////import "./vendor/@eth-optimism/contracts/0.4.7/contracts/optimistic-ethereum/iOVM/bridge/messaging/iOVM_CrossDomainMessenger.sol";
////import "./vendor/openzeppelin-solidity/v4.3.1/contracts/utils/Address.sol";

/**
 * @title OptimismCrossDomainForwarder - L1 xDomain account representation
 * @notice L2 Contract which receives messages from a specific L1 address and transparently forwards them to the destination.
 * @dev Any other L2 contract which uses this contract's address as a privileged position,
 *   can be considered to be owned by the `l1Owner`
 */
contract OptimismCrossDomainForwarder is TypeAndVersionInterface, CrossDomainForwarder {
  // OVM_L2CrossDomainMessenger is a precompile usually deployed to 0x4200000000000000000000000000000000000007
  iOVM_CrossDomainMessenger private immutable OVM_CROSS_DOMAIN_MESSENGER;

  /**
   * @notice creates a new Optimism xDomain Forwarder contract
   * @param crossDomainMessengerAddr the xDomain bridge messenger (Optimism bridge L2) contract address
   * @param l1OwnerAddr the L1 owner address that will be allowed to call the forward fn
   */
  constructor(iOVM_CrossDomainMessenger crossDomainMessengerAddr, address l1OwnerAddr) CrossDomainOwnable(l1OwnerAddr) {
    require(address(crossDomainMessengerAddr) != address(0), "Invalid xDomain Messenger address");
    OVM_CROSS_DOMAIN_MESSENGER = crossDomainMessengerAddr;
  }

  /**
   * @notice versions:
   *
   * - OptimismCrossDomainForwarder 0.1.0: initial release
   * - OptimismCrossDomainForwarder 1.0.0: Use OZ Address, CrossDomainOwnable
   *
   * @inheritdoc TypeAndVersionInterface
   */
  function typeAndVersion() external pure virtual override returns (string memory) {
    return "OptimismCrossDomainForwarder 1.0.0";
  }

  /**
   * @dev forwarded only if L2 Messenger calls with `xDomainMessageSender` being the L1 owner address
   * @inheritdoc ForwarderInterface
   */
  function forward(address target, bytes memory data) external virtual override onlyL1Owner {
    Address.functionCall(target, data, "Forwarder call reverted");
  }

  /**
   * @notice This is always the address of the OVM_L2CrossDomainMessenger contract
   */
  function crossDomainMessenger() public view returns (address) {
    return address(OVM_CROSS_DOMAIN_MESSENGER);
  }

  /**
   * @notice The call MUST come from the L1 owner (via cross-chain message.) Reverts otherwise.
   */
  modifier onlyL1Owner() override {
    require(msg.sender == crossDomainMessenger(), "Sender is not the L2 messenger");
    require(
      iOVM_CrossDomainMessenger(crossDomainMessenger()).xDomainMessageSender() == l1Owner(),
      "xDomain sender is not the L1 owner"
    );
    _;
  }

  /**
   * @notice The call MUST come from the proposed L1 owner (via cross-chain message.) Reverts otherwise.
   */
  modifier onlyProposedL1Owner() override {
    address messenger = crossDomainMessenger();
    require(msg.sender == messenger, "Sender is not the L2 messenger");
    require(
      iOVM_CrossDomainMessenger(messenger).xDomainMessageSender() == s_l1PendingOwner,
      "Must be proposed L1 owner"
    );
    _;
  }
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\OptimismCrossDomainGovernor.sol
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
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\OptimismCrossDomainGovernor.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

////import "./interfaces/DelegateForwarderInterface.sol";
////import "./vendor/@eth-optimism/contracts/0.4.7/contracts/optimistic-ethereum/iOVM/bridge/messaging/iOVM_CrossDomainMessenger.sol";
////import "./vendor/openzeppelin-solidity/v4.3.1/contracts/utils/Address.sol";
////import "./OptimismCrossDomainForwarder.sol";

/**
 * @title OptimismCrossDomainGovernor - L1 xDomain account representation (with delegatecall support) for Optimism
 * @notice L2 Contract which receives messages from a specific L1 address and transparently forwards them to the destination.
 * @dev Any other L2 contract which uses this contract's address as a privileged position,
 *   can be considered to be simultaneously owned by the `l1Owner` and L2 `owner`
 */
contract OptimismCrossDomainGovernor is DelegateForwarderInterface, OptimismCrossDomainForwarder {
  /**
   * @notice creates a new Optimism xDomain Forwarder contract
   * @param crossDomainMessengerAddr the xDomain bridge messenger (Optimism bridge L2) contract address
   * @param l1OwnerAddr the L1 owner address that will be allowed to call the forward fn
   * @dev Empty constructor required due to inheriting from abstract contract CrossDomainForwarder
   */
  constructor(iOVM_CrossDomainMessenger crossDomainMessengerAddr, address l1OwnerAddr)
    OptimismCrossDomainForwarder(crossDomainMessengerAddr, l1OwnerAddr)
  {}

  /**
   * @notice versions:
   *
   * - OptimismCrossDomainForwarder 1.0.0: initial release
   *
   * @inheritdoc TypeAndVersionInterface
   */
  function typeAndVersion() external pure virtual override returns (string memory) {
    return "OptimismCrossDomainGovernor 1.0.0";
  }

  /**
   * @dev forwarded only if L2 Messenger calls with `msg.sender` being the L1 owner address, or called by the L2 owner
   * @inheritdoc ForwarderInterface
   */
  function forward(address target, bytes memory data) external override onlyLocalOrCrossDomainOwner {
    Address.functionCall(target, data, "Governor call reverted");
  }

  /**
   * @dev forwarded only if L2 Messenger calls with `msg.sender` being the L1 owner address, or called by the L2 owner
   * @inheritdoc DelegateForwarderInterface
   */
  function forwardDelegate(address target, bytes memory data) external override onlyLocalOrCrossDomainOwner {
    Address.functionDelegateCall(target, data, "Governor delegatecall reverted");
  }

  /**
   * @notice The call MUST come from either the L1 owner (via cross-chain message) or the L2 owner. Reverts otherwise.
   */
  modifier onlyLocalOrCrossDomainOwner() {
    address messenger = crossDomainMessenger();
    // 1. The delegatecall MUST come from either the L1 owner (via cross-chain message) or the L2 owner
    require(msg.sender == messenger || msg.sender == owner(), "Sender is not the L2 messenger or owner");
    // 2. The L2 Messenger's caller MUST be the L1 Owner
    if (msg.sender == messenger) {
      require(
        iOVM_CrossDomainMessenger(messenger).xDomainMessageSender() == l1Owner(),
        "xDomain sender is not the L1 owner"
      );
    }
    _;
  }
}

