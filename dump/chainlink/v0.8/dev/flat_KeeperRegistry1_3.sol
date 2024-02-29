
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\KeeperRegistry1_3.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT

pragma solidity ^0.8.0;

enum UpkeepFormat {
  V1,
  V2,
  V3
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\KeeperRegistry1_3.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

interface AutomationCompatibleInterface {
  /**
   * @notice method that is simulated by the keepers to see if any work actually
   * needs to be performed. This method does does not actually need to be
   * executable, and since it is only ever simulated it can consume lots of gas.
   * @dev To ensure that it is never called, you may want to add the
   * cannotExecute modifier from KeeperBase to your implementation of this
   * method.
   * @param checkData specified in the upkeep registration so it is always the
   * same for a registered upkeep. This can easily be broken down into specific
   * arguments using `abi.decode`, so multiple upkeeps can be registered on the
   * same contract and easily differentiated by the contract.
   * @return upkeepNeeded boolean to indicate whether the keeper should call
   * performUpkeep or not.
   * @return performData bytes that the keeper should call performUpkeep with, if
   * upkeep is needed. If you would like to encode data to decode later, try
   * `abi.encode`.
   */
  function checkUpkeep(bytes calldata checkData) external returns (bool upkeepNeeded, bytes memory performData);

  /**
   * @notice method that is actually executed by the keepers, via the registry.
   * The data returned by the checkUpkeep simulation will be passed into
   * this method to actually be executed.
   * @dev The input to this method should not be trusted, and the caller of the
   * method should not even be restricted to any single registry. Anyone should
   * be able call it, and the input should be validated, there is no guarantee
   * that the data passed in is the performData returned from checkUpkeep. This
   * could happen due to malicious keepers, racing keepers, or simply a state
   * change while the performUpkeep transaction is waiting for confirmation.
   * Always validate the data passed in.
   * @param performData is the data which was passed back from the checkData
   * simulation. If it is encoded, it can easily be decoded into other types by
   * calling `abi.decode`. This data should not be trusted, and should be
   * validated against the contract's current state.
   */
  function performUpkeep(bytes calldata performData) external;
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\KeeperRegistry1_3.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

interface OwnableInterface {
  function owner() external returns (address);

  function transferOwnership(address recipient) external;

  function acceptOwnership() external;
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\KeeperRegistry1_3.sol
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
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\KeeperRegistry1_3.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT

////import "../UpkeepFormat.sol";

pragma solidity ^0.8.0;

interface UpkeepTranscoderInterface {
  function transcodeUpkeeps(
    UpkeepFormat fromVersion,
    UpkeepFormat toVersion,
    bytes calldata encodedUpkeeps
  ) external view returns (bytes memory);
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\KeeperRegistry1_3.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
/**
 * @notice This is a deprecated interface. Please use AutomationCompatibleInterface directly.
 */
pragma solidity ^0.8.0;
////import {AutomationCompatibleInterface as KeeperCompatibleInterface} from "./AutomationCompatibleInterface.sol";




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\KeeperRegistry1_3.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

interface LinkTokenInterface {
  function allowance(address owner, address spender) external view returns (uint256 remaining);

  function approve(address spender, uint256 value) external returns (bool success);

  function balanceOf(address owner) external view returns (uint256 balance);

  function decimals() external view returns (uint8 decimalPlaces);

  function decreaseApproval(address spender, uint256 addedValue) external returns (bool success);

  function increaseApproval(address spender, uint256 subtractedValue) external;

  function name() external view returns (string memory tokenName);

  function symbol() external view returns (string memory tokenSymbol);

  function totalSupply() external view returns (uint256 totalTokensIssued);

  function transfer(address to, uint256 value) external returns (bool success);

  function transferAndCall(
    address to,
    uint256 value,
    bytes calldata data
  ) external returns (bool success);

  function transferFrom(
    address from,
    address to,
    uint256 value
  ) external returns (bool success);
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\KeeperRegistry1_3.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

interface AggregatorV3Interface {
  function decimals() external view returns (uint8);

  function description() external view returns (string memory);

  function version() external view returns (uint256);

  function getRoundData(uint80 _roundId)
    external
    view
    returns (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound
    );

  function latestRoundData()
    external
    view
    returns (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound
    );
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\KeeperRegistry1_3.sol
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
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\KeeperRegistry1_3.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

/**
 * @notice config of the registry
 * @dev only used in params and return values
 * @member paymentPremiumPPB payment premium rate oracles receive on top of
 * being reimbursed for gas, measured in parts per billion
 * @member flatFeeMicroLink flat fee paid to oracles for performing upkeeps,
 * priced in MicroLink; can be used in conjunction with or independently of
 * paymentPremiumPPB
 * @member blockCountPerTurn number of blocks each oracle has during their turn to
 * perform upkeep before it will be the next keeper's turn to submit
 * @member checkGasLimit gas limit when checking for upkeep
 * @member stalenessSeconds number of seconds that is allowed for feed data to
 * be stale before switching to the fallback pricing
 * @member gasCeilingMultiplier multiplier to apply to the fast gas feed price
 * when calculating the payment ceiling for keepers
 * @member minUpkeepSpend minimum LINK that an upkeep must spend before cancelling
 * @member maxPerformGas max executeGas allowed for an upkeep on this registry
 * @member fallbackGasPrice gas price used if the gas price feed is stale
 * @member fallbackLinkPrice LINK price used if the LINK price feed is stale
 * @member transcoder address of the transcoder contract
 * @member registrar address of the registrar contract
 */
struct Config {
  uint32 paymentPremiumPPB;
  uint32 flatFeeMicroLink; // min 0.000001 LINK, max 4294 LINK
  uint24 blockCountPerTurn;
  uint32 checkGasLimit;
  uint24 stalenessSeconds;
  uint16 gasCeilingMultiplier;
  uint96 minUpkeepSpend;
  uint32 maxPerformGas;
  uint256 fallbackGasPrice;
  uint256 fallbackLinkPrice;
  address transcoder;
  address registrar;
}

/**
 * @notice state of the registry
 * @dev only used in params and return values
 * @member nonce used for ID generation
 * @member ownerLinkBalance withdrawable balance of LINK by contract owner
 * @member expectedLinkBalance the expected balance of LINK of the registry
 * @member numUpkeeps total number of upkeeps on the registry
 */
struct State {
  uint32 nonce;
  uint96 ownerLinkBalance;
  uint256 expectedLinkBalance;
  uint256 numUpkeeps;
}

/**
 * @notice relevant state of an upkeep
 * @member balance the balance of this upkeep
 * @member lastKeeper the keeper which last performs the upkeep
 * @member executeGas the gas limit of upkeep execution
 * @member maxValidBlocknumber until which block this upkeep is valid
 * @member target the contract which needs to be serviced
 * @member amountSpent the amount this upkeep has spent
 * @member admin the upkeep admin
 * @member paused if this upkeep has been paused
 */
struct Upkeep {
  uint96 balance;
  address lastKeeper; // 1 full evm word
  uint96 amountSpent;
  address admin; // 2 full evm words
  uint32 executeGas;
  uint32 maxValidBlocknumber;
  address target;
  bool paused; // 24 bits to 3 full evm words
}

interface KeeperRegistryBaseInterface {
  function registerUpkeep(
    address target,
    uint32 gasLimit,
    address admin,
    bytes calldata checkData
  ) external returns (uint256 id);

  function performUpkeep(uint256 id, bytes calldata performData) external returns (bool success);

  function cancelUpkeep(uint256 id) external;

  function pauseUpkeep(uint256 id) external;

  function unpauseUpkeep(uint256 id) external;

  function transferUpkeepAdmin(uint256 id, address proposed) external;

  function acceptUpkeepAdmin(uint256 id) external;

  function updateCheckData(uint256 id, bytes calldata newCheckData) external;

  function addFunds(uint256 id, uint96 amount) external;

  function setUpkeepGasLimit(uint256 id, uint32 gasLimit) external;

  function getUpkeep(uint256 id)
    external
    view
    returns (
      address target,
      uint32 executeGas,
      bytes memory checkData,
      uint96 balance,
      address lastKeeper,
      address admin,
      uint64 maxValidBlocknumber,
      uint96 amountSpent,
      bool paused
    );

  function getActiveUpkeepIDs(uint256 startIndex, uint256 maxCount) external view returns (uint256[] memory);

  function getKeeperInfo(address query)
    external
    view
    returns (
      address payee,
      bool active,
      uint96 balance
    );

  function getState()
    external
    view
    returns (
      State memory,
      Config memory,
      address[] memory
    );
}

/**
 * @dev The view methods are not actually marked as view in the implementation
 * but we want them to be easily queried off-chain. Solidity will not compile
 * if we actually inherit from this interface, so we document it here.
 */
interface KeeperRegistryInterface is KeeperRegistryBaseInterface {
  function checkUpkeep(uint256 upkeepId, address from)
    external
    view
    returns (
      bytes memory performData,
      uint256 maxLinkPayment,
      uint256 gasLimit,
      int256 gasWei,
      int256 linkEth
    );
}

interface KeeperRegistryExecutableInterface is KeeperRegistryBaseInterface {
  function checkUpkeep(uint256 upkeepId, address from)
    external
    returns (
      bytes memory performData,
      uint256 maxLinkPayment,
      uint256 gasLimit,
      uint256 adjustedGasWei,
      uint256 linkEth
    );
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\KeeperRegistry1_3.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

abstract contract ExecutionPrevention {
  error OnlySimulatedBackend();

  /**
   * @notice method that allows it to be simulated via eth_call by checking that
   * the sender is the zero address.
   */
  function preventExecution() internal view {
    if (tx.origin != address(0)) {
      revert OnlySimulatedBackend();
    }
  }

  /**
   * @notice modifier that allows it to be simulated via eth_call by checking
   * that the sender is the zero address.
   */
  modifier cannotExecute() {
    preventExecution();
    _;
  }
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\KeeperRegistry1_3.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity 0.8.6;

/* External ////Imports */
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title OVM_GasPriceOracle
 * @dev This contract exposes the current l2 gas price, a measure of how congested the network
 * currently is. This measure is used by the Sequencer to determine what fee to charge for
 * transactions. When the system is more congested, the l2 gas price will increase and fees
 * will also increase as a result.
 *
 * All public variables are set while generating the initial L2 state. The
 * constructor doesn't run in practice as the L2 state generation script uses
 * the deployed bytecode instead of running the initcode.
 */
contract OVM_GasPriceOracle is Ownable {
    /*************
     * Variables *
     *************/

    // Current L2 gas price
    uint256 public gasPrice;
    // Current L1 base fee
    uint256 public l1BaseFee;
    // Amortized cost of batch submission per transaction
    uint256 public overhead;
    // Value to scale the fee up by
    uint256 public scalar;
    // Number of decimals of the scalar
    uint256 public decimals;

    /***************
     * Constructor *
     ***************/

    /**
     * @param _owner Address that will initially own this contract.
     */
    constructor(address _owner) Ownable() {
        transferOwnership(_owner);
    }

    /**********
     * Events *
     **********/

    event GasPriceUpdated(uint256);
    event L1BaseFeeUpdated(uint256);
    event OverheadUpdated(uint256);
    event ScalarUpdated(uint256);
    event DecimalsUpdated(uint256);

    /********************
     * Public Functions *
     ********************/

    /**
     * Allows the owner to modify the l2 gas price.
     * @param _gasPrice New l2 gas price.
     */
    // slither-disable-next-line external-function
    function setGasPrice(uint256 _gasPrice) public onlyOwner {
        gasPrice = _gasPrice;
        emit GasPriceUpdated(_gasPrice);
    }

    /**
     * Allows the owner to modify the l1 base fee.
     * @param _baseFee New l1 base fee
     */
    // slither-disable-next-line external-function
    function setL1BaseFee(uint256 _baseFee) public onlyOwner {
        l1BaseFee = _baseFee;
        emit L1BaseFeeUpdated(_baseFee);
    }

    /**
     * Allows the owner to modify the overhead.
     * @param _overhead New overhead
     */
    // slither-disable-next-line external-function
    function setOverhead(uint256 _overhead) public onlyOwner {
        overhead = _overhead;
        emit OverheadUpdated(_overhead);
    }

    /**
     * Allows the owner to modify the scalar.
     * @param _scalar New scalar
     */
    // slither-disable-next-line external-function
    function setScalar(uint256 _scalar) public onlyOwner {
        scalar = _scalar;
        emit ScalarUpdated(_scalar);
    }

    /**
     * Allows the owner to modify the decimals.
     * @param _decimals New decimals
     */
    // slither-disable-next-line external-function
    function setDecimals(uint256 _decimals) public onlyOwner {
        decimals = _decimals;
        emit DecimalsUpdated(_decimals);
    }

    /**
     * Computes the L1 portion of the fee
     * based on the size of the RLP encoded tx
     * and the current l1BaseFee
     * @param _data Unsigned RLP encoded tx, 6 elements
     * @return L1 fee that should be paid for the tx
     */
    // slither-disable-next-line external-function
    function getL1Fee(bytes memory _data) public view returns (uint256) {
        uint256 l1GasUsed = getL1GasUsed(_data);
        uint256 l1Fee = l1GasUsed * l1BaseFee;
        uint256 divisor = 10**decimals;
        uint256 unscaled = l1Fee * scalar;
        uint256 scaled = unscaled / divisor;
        return scaled;
    }

    // solhint-disable max-line-length
    /**
     * Computes the amount of L1 gas used for a transaction
     * The overhead represents the per batch gas overhead of
     * posting both transaction and state roots to L1 given larger
     * batch sizes.
     * 4 gas for 0 byte
     * https://github.com/ethereum/go-ethereum/blob/9ada4a2e2c415e6b0b51c50e901336872e028872/params/protocol_params.go#L33
     * 16 gas for non zero byte
     * https://github.com/ethereum/go-ethereum/blob/9ada4a2e2c415e6b0b51c50e901336872e028872/params/protocol_params.go#L87
     * This will need to be updated if calldata gas prices change
     * Account for the transaction being unsigned
     * Padding is added to account for lack of signature on transaction
     * 1 byte for RLP V prefix
     * 1 byte for V
     * 1 byte for RLP R prefix
     * 32 bytes for R
     * 1 byte for RLP S prefix
     * 32 bytes for S
     * Total: 68 bytes of padding
     * @param _data Unsigned RLP encoded tx, 6 elements
     * @return Amount of L1 gas used for a transaction
     */
    // solhint-enable max-line-length
    function getL1GasUsed(bytes memory _data) public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < _data.length; i++) {
            if (_data[i] == 0) {
                total += 4;
            } else {
                total += 16;
            }
        }
        uint256 unsigned = total + overhead;
        return unsigned + (68 * 16);
    }
}



/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\KeeperRegistry1_3.sol
*/
            
pragma solidity >=0.4.21 <0.9.0;

interface ArbGasInfo {
    // return gas prices in wei, assuming the specified aggregator is used
    //        (
    //            per L2 tx,
    //            per L1 calldata unit, (zero byte = 4 units, nonzero byte = 16 units)
    //            per storage allocation,
    //            per ArbGas base,
    //            per ArbGas congestion,
    //            per ArbGas total
    //        )
    function getPricesInWeiWithAggregator(address aggregator) external view returns (uint, uint, uint, uint, uint, uint);

    // return gas prices in wei, as described above, assuming the caller's preferred aggregator is used
    //     if the caller hasn't specified a preferred aggregator, the default aggregator is assumed
    function getPricesInWei() external view returns (uint, uint, uint, uint, uint, uint);

    // return prices in ArbGas (per L2 tx, per L1 calldata unit, per storage allocation),
    //       assuming the specified aggregator is used
    function getPricesInArbGasWithAggregator(address aggregator) external view returns (uint, uint, uint);

    // return gas prices in ArbGas, as described above, assuming the caller's preferred aggregator is used
    //     if the caller hasn't specified a preferred aggregator, the default aggregator is assumed
    function getPricesInArbGas() external view returns (uint, uint, uint);

    // return gas accounting parameters (speedLimitPerSecond, gasPoolMax, maxTxGasLimit)
    function getGasAccountingParams() external view returns (uint, uint, uint);

    // get ArbOS's estimate of the L1 gas price in wei
    function getL1GasPriceEstimate() external view returns(uint);

    // set ArbOS's estimate of the L1 gas price in wei
    // reverts unless called by chain owner or designated gas oracle (if any)
    function setL1GasPriceEstimate(uint priceInWei) external;

    // get L1 gas fees paid by the current transaction (txBaseFeeWei, calldataFeeWei)
    function getCurrentTxL1GasFees() external view returns(uint);
}



/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\KeeperRegistry1_3.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT

pragma solidity ^0.8.0;

////import "../UpkeepFormat.sol";

interface MigratableKeeperRegistryInterface {
  /**
   * @notice Migrates upkeeps from one registry to another, including LINK and upkeep params.
   * Only callable by the upkeep admin. All upkeeps must have the same admin. Can only migrate active upkeeps.
   * @param upkeepIDs ids of upkeeps to migrate
   * @param destination the address of the registry to migrate to
   */
  function migrateUpkeeps(uint256[] calldata upkeepIDs, address destination) external;

  /**
   * @notice Called by other registries when migrating upkeeps. Only callable by other registries.
   * @param encodedUpkeeps abi encoding of upkeeps to ////import - decoded by the transcoder
   */
  function receiveUpkeeps(bytes calldata encodedUpkeeps) external;

  /**
   * @notice Specifies the version of upkeep data that this registry requires in order to ////import
   */
  function upkeepTranscoderVersion() external returns (UpkeepFormat version);
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\KeeperRegistry1_3.sol
*/
            
pragma solidity 0.8.6;

////import "@openzeppelin/contracts/security/Pausable.sol";
////import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
////import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
////import "./vendor/@arbitrum/nitro-contracts/src/precompiles/ArbGasInfo.sol";
////import "./vendor/@eth-optimism/contracts/0.8.6/contracts/L2/predeploys/OVM_GasPriceOracle.sol";
////import "./ExecutionPrevention.sol";
////import {Config, State, Upkeep} from "./interfaces/KeeperRegistryInterface1_3.sol";
////import "../ConfirmedOwner.sol";
////import "../interfaces/AggregatorV3Interface.sol";
////import "../interfaces/LinkTokenInterface.sol";
////import "../interfaces/KeeperCompatibleInterface.sol";
////import "../interfaces/UpkeepTranscoderInterface.sol";

/**
 * @notice Base Keeper Registry contract, contains shared logic between
 * KeeperRegistry and KeeperRegistryLogic
 */
abstract contract KeeperRegistryBase is ConfirmedOwner, ExecutionPrevention, ReentrancyGuard, Pausable {
  address internal constant ZERO_ADDRESS = address(0);
  address internal constant IGNORE_ADDRESS = 0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF;
  bytes4 internal constant CHECK_SELECTOR = KeeperCompatibleInterface.checkUpkeep.selector;
  bytes4 internal constant PERFORM_SELECTOR = KeeperCompatibleInterface.performUpkeep.selector;
  uint256 internal constant PERFORM_GAS_MIN = 2_300;
  uint256 internal constant CANCELLATION_DELAY = 50;
  uint256 internal constant PERFORM_GAS_CUSHION = 5_000;
  uint256 internal constant PPB_BASE = 1_000_000_000;
  uint32 internal constant UINT32_MAX = type(uint32).max;
  uint96 internal constant LINK_TOTAL_SUPPLY = 1e27;
  UpkeepFormat internal constant UPKEEP_TRANSCODER_VERSION_BASE = UpkeepFormat.V2;
  // L1_FEE_DATA_PADDING includes 35 bytes for L1 data padding for Optimism
  bytes internal constant L1_FEE_DATA_PADDING =
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
  // MAX_INPUT_DATA represents the estimated max size of the sum of L1 data padding and msg.data in performUpkeep
  // function, which includes 4 bytes for function selector, 32 bytes for upkeep id, 35 bytes for data padding, and
  // 64 bytes for estimated perform data
  bytes internal constant MAX_INPUT_DATA =
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

  address[] internal s_keeperList;
  EnumerableSet.UintSet internal s_upkeepIDs;
  mapping(uint256 => Upkeep) internal s_upkeep;
  mapping(address => KeeperInfo) internal s_keeperInfo;
  mapping(address => address) internal s_proposedPayee;
  mapping(uint256 => address) internal s_proposedAdmin;
  mapping(uint256 => bytes) internal s_checkData;
  mapping(address => MigrationPermission) internal s_peerRegistryMigrationPermission;
  Storage internal s_storage;
  uint256 internal s_fallbackGasPrice; // not in config object for gas savings
  uint256 internal s_fallbackLinkPrice; // not in config object for gas savings
  uint96 internal s_ownerLinkBalance;
  uint256 internal s_expectedLinkBalance;
  address internal s_transcoder;
  address internal s_registrar;

  LinkTokenInterface public immutable LINK;
  AggregatorV3Interface public immutable LINK_ETH_FEED;
  AggregatorV3Interface public immutable FAST_GAS_FEED;
  OVM_GasPriceOracle public immutable OPTIMISM_ORACLE = OVM_GasPriceOracle(0x420000000000000000000000000000000000000F);
  ArbGasInfo public immutable ARB_NITRO_ORACLE = ArbGasInfo(0x000000000000000000000000000000000000006C);
  PaymentModel public immutable PAYMENT_MODEL;
  uint256 public immutable REGISTRY_GAS_OVERHEAD;

  error ArrayHasNoEntries();
  error CannotCancel();
  error DuplicateEntry();
  error EmptyAddress();
  error GasLimitCanOnlyIncrease();
  error GasLimitOutsideRange();
  error IndexOutOfRange();
  error InsufficientFunds();
  error InvalidDataLength();
  error InvalidPayee();
  error InvalidRecipient();
  error KeepersMustTakeTurns();
  error MigrationNotPermitted();
  error NotAContract();
  error OnlyActiveKeepers();
  error OnlyCallableByAdmin();
  error OnlyCallableByLINKToken();
  error OnlyCallableByOwnerOrAdmin();
  error OnlyCallableByOwnerOrRegistrar();
  error OnlyCallableByPayee();
  error OnlyCallableByProposedAdmin();
  error OnlyCallableByProposedPayee();
  error OnlyPausedUpkeep();
  error OnlyUnpausedUpkeep();
  error ParameterLengthError();
  error PaymentGreaterThanAllLINK();
  error TargetCheckReverted(bytes reason);
  error TranscoderNotSet();
  error UpkeepCancelled();
  error UpkeepNotCanceled();
  error UpkeepNotNeeded();
  error ValueNotChanged();

  enum MigrationPermission {
    NONE,
    OUTGOING,
    INCOMING,
    BIDIRECTIONAL
  }

  enum PaymentModel {
    DEFAULT,
    ARBITRUM,
    OPTIMISM
  }

  /**
   * @notice storage of the registry, contains a mix of config and state data
   */
  struct Storage {
    uint32 paymentPremiumPPB;
    uint32 flatFeeMicroLink;
    uint24 blockCountPerTurn;
    uint32 checkGasLimit;
    uint24 stalenessSeconds;
    uint16 gasCeilingMultiplier;
    uint96 minUpkeepSpend; // 1 full evm word
    uint32 maxPerformGas;
    uint32 nonce;
  }

  struct KeeperInfo {
    address payee;
    uint96 balance;
    bool active;
  }

  struct PerformParams {
    address from;
    uint256 id;
    bytes performData;
    uint256 maxLinkPayment;
    uint256 gasLimit;
    uint256 fastGasWei;
    uint256 linkEth;
  }

  event ConfigSet(Config config);
  event FundsAdded(uint256 indexed id, address indexed from, uint96 amount);
  event FundsWithdrawn(uint256 indexed id, uint256 amount, address to);
  event KeepersUpdated(address[] keepers, address[] payees);
  event OwnerFundsWithdrawn(uint96 amount);
  event PayeeshipTransferRequested(address indexed keeper, address indexed from, address indexed to);
  event PayeeshipTransferred(address indexed keeper, address indexed from, address indexed to);
  event PaymentWithdrawn(address indexed keeper, uint256 indexed amount, address indexed to, address payee);
  event UpkeepAdminTransferRequested(uint256 indexed id, address indexed from, address indexed to);
  event UpkeepAdminTransferred(uint256 indexed id, address indexed from, address indexed to);
  event UpkeepCanceled(uint256 indexed id, uint64 indexed atBlockHeight);
  event UpkeepCheckDataUpdated(uint256 indexed id, bytes newCheckData);
  event UpkeepGasLimitSet(uint256 indexed id, uint96 gasLimit);
  event UpkeepMigrated(uint256 indexed id, uint256 remainingBalance, address destination);
  event UpkeepPaused(uint256 indexed id);
  event UpkeepPerformed(
    uint256 indexed id,
    bool indexed success,
    address indexed from,
    uint96 payment,
    bytes performData
  );
  event UpkeepReceived(uint256 indexed id, uint256 startingBalance, address ////importedFrom);
  event UpkeepUnpaused(uint256 indexed id);
  event UpkeepRegistered(uint256 indexed id, uint32 executeGas, address admin);

  /**
   * @param paymentModel the payment model of default, Arbitrum, or Optimism
   * @param registryGasOverhead the gas overhead used by registry in performUpkeep
   * @param link address of the LINK Token
   * @param linkEthFeed address of the LINK/ETH price feed
   * @param fastGasFeed address of the Fast Gas price feed
   */
  constructor(
    PaymentModel paymentModel,
    uint256 registryGasOverhead,
    address link,
    address linkEthFeed,
    address fastGasFeed
  ) ConfirmedOwner(msg.sender) {
    PAYMENT_MODEL = paymentModel;
    REGISTRY_GAS_OVERHEAD = registryGasOverhead;
    if (ZERO_ADDRESS == link || ZERO_ADDRESS == linkEthFeed || ZERO_ADDRESS == fastGasFeed) {
      revert EmptyAddress();
    }
    LINK = LinkTokenInterface(link);
    LINK_ETH_FEED = AggregatorV3Interface(linkEthFeed);
    FAST_GAS_FEED = AggregatorV3Interface(fastGasFeed);
  }

  /**
   * @dev retrieves feed data for fast gas/eth and link/eth prices. if the feed
   * data is stale it uses the configured fallback price. Once a price is picked
   * for gas it takes the min of gas price in the transaction or the fast gas
   * price in order to reduce costs for the upkeep clients.
   */
  function _getFeedData() internal view returns (uint256 gasWei, uint256 linkEth) {
    uint32 stalenessSeconds = s_storage.stalenessSeconds;
    bool staleFallback = stalenessSeconds > 0;
    uint256 timestamp;
    int256 feedValue;
    (, feedValue, , timestamp, ) = FAST_GAS_FEED.latestRoundData();
    if ((staleFallback && stalenessSeconds < block.timestamp - timestamp) || feedValue <= 0) {
      gasWei = s_fallbackGasPrice;
    } else {
      gasWei = uint256(feedValue);
    }
    (, feedValue, , timestamp, ) = LINK_ETH_FEED.latestRoundData();
    if ((staleFallback && stalenessSeconds < block.timestamp - timestamp) || feedValue <= 0) {
      linkEth = s_fallbackLinkPrice;
    } else {
      linkEth = uint256(feedValue);
    }
    return (gasWei, linkEth);
  }

  /**
   * @dev calculates LINK paid for gas spent plus a configure premium percentage
   * @param gasLimit the amount of gas used
   * @param fastGasWei the fast gas price
   * @param linkEth the exchange ratio between LINK and ETH
   * @param isExecution if this is triggered by a perform upkeep function
   */
  function _calculatePaymentAmount(
    uint256 gasLimit,
    uint256 fastGasWei,
    uint256 linkEth,
    bool isExecution
  ) internal view returns (uint96 payment) {
    Storage memory store = s_storage;
    uint256 gasWei = fastGasWei * store.gasCeilingMultiplier;
    // in case it's actual execution use actual gas price, capped by fastGasWei * gasCeilingMultiplier
    if (isExecution && tx.gasprice < gasWei) {
      gasWei = tx.gasprice;
    }

    uint256 weiForGas = gasWei * (gasLimit + REGISTRY_GAS_OVERHEAD);
    uint256 premium = PPB_BASE + store.paymentPremiumPPB;
    uint256 l1CostWei = 0;
    if (PAYMENT_MODEL == PaymentModel.OPTIMISM) {
      bytes memory txCallData = new bytes(0);
      if (isExecution) {
        txCallData = bytes.concat(msg.data, L1_FEE_DATA_PADDING);
      } else {
        txCallData = MAX_INPUT_DATA;
      }
      l1CostWei = OPTIMISM_ORACLE.getL1Fee(txCallData);
    } else if (PAYMENT_MODEL == PaymentModel.ARBITRUM) {
      l1CostWei = ARB_NITRO_ORACLE.getCurrentTxL1GasFees();
    }
    // if it's not performing upkeeps, use gas ceiling multiplier to estimate the upper bound
    if (!isExecution) {
      l1CostWei = store.gasCeilingMultiplier * l1CostWei;
    }

    uint256 total = ((weiForGas + l1CostWei) * 1e9 * premium) / linkEth + uint256(store.flatFeeMicroLink) * 1e12;
    if (total > LINK_TOTAL_SUPPLY) revert PaymentGreaterThanAllLINK();
    return uint96(total); // LINK_TOTAL_SUPPLY < UINT96_MAX
  }

  /**
   * @dev ensures all required checks are passed before an upkeep is performed
   */
  function _prePerformUpkeep(
    Upkeep memory upkeep,
    address from,
    uint256 maxLinkPayment
  ) internal view {
    if (upkeep.paused) revert OnlyUnpausedUpkeep();
    if (!s_keeperInfo[from].active) revert OnlyActiveKeepers();
    if (upkeep.balance < maxLinkPayment) revert InsufficientFunds();
    if (upkeep.lastKeeper == from) revert KeepersMustTakeTurns();
  }

  /**
   * @dev ensures the upkeep is not cancelled and the caller is the upkeep admin
   */
  function requireAdminAndNotCancelled(Upkeep memory upkeep) internal view {
    if (msg.sender != upkeep.admin) revert OnlyCallableByAdmin();
    if (upkeep.maxValidBlocknumber != UINT32_MAX) revert UpkeepCancelled();
  }

  /**
   * @dev generates a PerformParams struct for use in _performUpkeepWithParams()
   */
  function _generatePerformParams(
    address from,
    uint256 id,
    bytes memory performData,
    bool isExecution
  ) internal view returns (PerformParams memory) {
    uint256 gasLimit = s_upkeep[id].executeGas;
    (uint256 fastGasWei, uint256 linkEth) = _getFeedData();
    uint96 maxLinkPayment = _calculatePaymentAmount(gasLimit, fastGasWei, linkEth, isExecution);

    return
      PerformParams({
        from: from,
        id: id,
        performData: performData,
        maxLinkPayment: maxLinkPayment,
        gasLimit: gasLimit,
        fastGasWei: fastGasWei,
        linkEth: linkEth
      });
  }
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\KeeperRegistry1_3.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.6;

interface ERC677ReceiverInterface {
  function onTokenTransfer(
    address sender,
    uint256 amount,
    bytes calldata data
  ) external;
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\KeeperRegistry1_3.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;

abstract contract TypeAndVersionInterface {
  function typeAndVersion() external pure virtual returns (string memory);
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\KeeperRegistry1_3.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity 0.8.6;

////import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
////import "@openzeppelin/contracts/utils/Address.sol";
////import "./KeeperRegistryBase.sol";
////import "../interfaces/MigratableKeeperRegistryInterface.sol";
////import "../interfaces/UpkeepTranscoderInterface.sol";

/**
 * @notice Logic contract, works in tandem with KeeperRegistry as a proxy
 */
contract KeeperRegistryLogic1_3 is KeeperRegistryBase {
  using Address for address;
  using EnumerableSet for EnumerableSet.UintSet;

  /**
   * @param paymentModel one of Default, Arbitrum, Optimism
   * @param registryGasOverhead the gas overhead used by registry in performUpkeep
   * @param link address of the LINK Token
   * @param linkEthFeed address of the LINK/ETH price feed
   * @param fastGasFeed address of the Fast Gas price feed
   */
  constructor(
    PaymentModel paymentModel,
    uint256 registryGasOverhead,
    address link,
    address linkEthFeed,
    address fastGasFeed
  ) KeeperRegistryBase(paymentModel, registryGasOverhead, link, linkEthFeed, fastGasFeed) {}

  function checkUpkeep(uint256 id, address from)
    external
    cannotExecute
    returns (
      bytes memory performData,
      uint256 maxLinkPayment,
      uint256 gasLimit,
      uint256 adjustedGasWei,
      uint256 linkEth
    )
  {
    Upkeep memory upkeep = s_upkeep[id];

    bytes memory callData = abi.encodeWithSelector(CHECK_SELECTOR, s_checkData[id]);
    (bool success, bytes memory result) = upkeep.target.call{gas: s_storage.checkGasLimit}(callData);

    if (!success) revert TargetCheckReverted(result);

    (success, performData) = abi.decode(result, (bool, bytes));
    if (!success) revert UpkeepNotNeeded();

    PerformParams memory params = _generatePerformParams(from, id, performData, false);
    _prePerformUpkeep(upkeep, params.from, params.maxLinkPayment);

    return (
      performData,
      params.maxLinkPayment,
      params.gasLimit,
      // adjustedGasWei equals fastGasWei multiplies gasCeilingMultiplier in non-execution cases
      params.fastGasWei * s_storage.gasCeilingMultiplier,
      params.linkEth
    );
  }

  /**
   * @dev Called through KeeperRegistry main contract
   */
  function withdrawOwnerFunds() external onlyOwner {
    uint96 amount = s_ownerLinkBalance;

    s_expectedLinkBalance = s_expectedLinkBalance - amount;
    s_ownerLinkBalance = 0;

    emit OwnerFundsWithdrawn(amount);
    LINK.transfer(msg.sender, amount);
  }

  /**
   * @dev Called through KeeperRegistry main contract
   */
  function recoverFunds() external onlyOwner {
    uint256 total = LINK.balanceOf(address(this));
    LINK.transfer(msg.sender, total - s_expectedLinkBalance);
  }

  /**
   * @dev Called through KeeperRegistry main contract
   */
  function setKeepers(address[] calldata keepers, address[] calldata payees) external onlyOwner {
    if (keepers.length != payees.length || keepers.length < 2) revert ParameterLengthError();
    for (uint256 i = 0; i < s_keeperList.length; i++) {
      address keeper = s_keeperList[i];
      s_keeperInfo[keeper].active = false;
    }
    for (uint256 i = 0; i < keepers.length; i++) {
      address keeper = keepers[i];
      KeeperInfo storage s_keeper = s_keeperInfo[keeper];
      address oldPayee = s_keeper.payee;
      address newPayee = payees[i];
      if (
        (newPayee == ZERO_ADDRESS) || (oldPayee != ZERO_ADDRESS && oldPayee != newPayee && newPayee != IGNORE_ADDRESS)
      ) revert InvalidPayee();
      if (s_keeper.active) revert DuplicateEntry();
      s_keeper.active = true;
      if (newPayee != IGNORE_ADDRESS) {
        s_keeper.payee = newPayee;
      }
    }
    s_keeperList = keepers;
    emit KeepersUpdated(keepers, payees);
  }

  /**
   * @dev Called through KeeperRegistry main contract
   */
  function pause() external onlyOwner {
    _pause();
  }

  /**
   * @dev Called through KeeperRegistry main contract
   */
  function unpause() external onlyOwner {
    _unpause();
  }

  /**
   * @dev Called through KeeperRegistry main contract
   */
  function setPeerRegistryMigrationPermission(address peer, MigrationPermission permission) external onlyOwner {
    s_peerRegistryMigrationPermission[peer] = permission;
  }

  /**
   * @dev Called through KeeperRegistry main contract
   */
  function registerUpkeep(
    address target,
    uint32 gasLimit,
    address admin,
    bytes calldata checkData
  ) external returns (uint256 id) {
    if (msg.sender != owner() && msg.sender != s_registrar) revert OnlyCallableByOwnerOrRegistrar();

    id = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), address(this), s_storage.nonce)));
    _createUpkeep(id, target, gasLimit, admin, 0, checkData, false);
    s_storage.nonce++;
    emit UpkeepRegistered(id, gasLimit, admin);
    return id;
  }

  /**
   * @dev Called through KeeperRegistry main contract
   */
  function cancelUpkeep(uint256 id) external {
    Upkeep memory upkeep = s_upkeep[id];
    bool canceled = upkeep.maxValidBlocknumber != UINT32_MAX;
    bool isOwner = msg.sender == owner();

    if (canceled && !(isOwner && upkeep.maxValidBlocknumber > block.number)) revert CannotCancel();
    if (!isOwner && msg.sender != upkeep.admin) revert OnlyCallableByOwnerOrAdmin();

    uint256 height = block.number;
    if (!isOwner) {
      height = height + CANCELLATION_DELAY;
    }
    s_upkeep[id].maxValidBlocknumber = uint32(height);
    s_upkeepIDs.remove(id);

    // charge the cancellation fee if the minUpkeepSpend is not met
    uint96 minUpkeepSpend = s_storage.minUpkeepSpend;
    uint96 cancellationFee = 0;
    // cancellationFee is supposed to be min(max(minUpkeepSpend - amountSpent,0), amountLeft)
    if (upkeep.amountSpent < minUpkeepSpend) {
      cancellationFee = minUpkeepSpend - upkeep.amountSpent;
      if (cancellationFee > upkeep.balance) {
        cancellationFee = upkeep.balance;
      }
    }
    s_upkeep[id].balance = upkeep.balance - cancellationFee;
    s_ownerLinkBalance = s_ownerLinkBalance + cancellationFee;

    emit UpkeepCanceled(id, uint64(height));
  }

  /**
   * @dev Called through KeeperRegistry main contract
   */
  function addFunds(uint256 id, uint96 amount) external {
    Upkeep memory upkeep = s_upkeep[id];
    if (upkeep.maxValidBlocknumber != UINT32_MAX) revert UpkeepCancelled();

    s_upkeep[id].balance = upkeep.balance + amount;
    s_expectedLinkBalance = s_expectedLinkBalance + amount;
    LINK.transferFrom(msg.sender, address(this), amount);
    emit FundsAdded(id, msg.sender, amount);
  }

  /**
   * @dev Called through KeeperRegistry main contract
   */
  function withdrawFunds(uint256 id, address to) external {
    if (to == ZERO_ADDRESS) revert InvalidRecipient();
    Upkeep memory upkeep = s_upkeep[id];
    if (upkeep.admin != msg.sender) revert OnlyCallableByAdmin();
    if (upkeep.maxValidBlocknumber > block.number) revert UpkeepNotCanceled();

    uint96 amountToWithdraw = s_upkeep[id].balance;
    s_expectedLinkBalance = s_expectedLinkBalance - amountToWithdraw;
    s_upkeep[id].balance = 0;
    emit FundsWithdrawn(id, amountToWithdraw, to);

    LINK.transfer(to, amountToWithdraw);
  }

  /**
   * @dev Called through KeeperRegistry main contract
   */
  function setUpkeepGasLimit(uint256 id, uint32 gasLimit) external {
    if (gasLimit < PERFORM_GAS_MIN || gasLimit > s_storage.maxPerformGas) revert GasLimitOutsideRange();
    Upkeep memory upkeep = s_upkeep[id];
    if (upkeep.maxValidBlocknumber != UINT32_MAX) revert UpkeepCancelled();
    if (upkeep.admin != msg.sender) revert OnlyCallableByAdmin();

    s_upkeep[id].executeGas = gasLimit;

    emit UpkeepGasLimitSet(id, gasLimit);
  }

  /**
   * @dev Called through KeeperRegistry main contract
   */
  function withdrawPayment(address from, address to) external {
    if (to == ZERO_ADDRESS) revert InvalidRecipient();
    KeeperInfo memory keeper = s_keeperInfo[from];
    if (keeper.payee != msg.sender) revert OnlyCallableByPayee();

    s_keeperInfo[from].balance = 0;
    s_expectedLinkBalance = s_expectedLinkBalance - keeper.balance;
    emit PaymentWithdrawn(from, keeper.balance, to, msg.sender);

    LINK.transfer(to, keeper.balance);
  }

  /**
   * @dev Called through KeeperRegistry main contract
   */
  function transferPayeeship(address keeper, address proposed) external {
    if (s_keeperInfo[keeper].payee != msg.sender) revert OnlyCallableByPayee();
    if (proposed == msg.sender) revert ValueNotChanged();

    if (s_proposedPayee[keeper] != proposed) {
      s_proposedPayee[keeper] = proposed;
      emit PayeeshipTransferRequested(keeper, msg.sender, proposed);
    }
  }

  /**
   * @dev Called through KeeperRegistry main contract
   */
  function acceptPayeeship(address keeper) external {
    if (s_proposedPayee[keeper] != msg.sender) revert OnlyCallableByProposedPayee();
    address past = s_keeperInfo[keeper].payee;
    s_keeperInfo[keeper].payee = msg.sender;
    s_proposedPayee[keeper] = ZERO_ADDRESS;

    emit PayeeshipTransferred(keeper, past, msg.sender);
  }

  /**
   * @dev Called through KeeperRegistry main contract
   */
  function transferUpkeepAdmin(uint256 id, address proposed) external {
    Upkeep memory upkeep = s_upkeep[id];
    requireAdminAndNotCancelled(upkeep);
    if (proposed == msg.sender) revert ValueNotChanged();
    if (proposed == ZERO_ADDRESS) revert InvalidRecipient();

    if (s_proposedAdmin[id] != proposed) {
      s_proposedAdmin[id] = proposed;
      emit UpkeepAdminTransferRequested(id, msg.sender, proposed);
    }
  }

  /**
   * @dev Called through KeeperRegistry main contract
   */
  function acceptUpkeepAdmin(uint256 id) external {
    Upkeep memory upkeep = s_upkeep[id];
    if (upkeep.maxValidBlocknumber != UINT32_MAX) revert UpkeepCancelled();
    if (s_proposedAdmin[id] != msg.sender) revert OnlyCallableByProposedAdmin();
    address past = upkeep.admin;
    s_upkeep[id].admin = msg.sender;
    s_proposedAdmin[id] = ZERO_ADDRESS;

    emit UpkeepAdminTransferred(id, past, msg.sender);
  }

  /**
   * @dev Called through KeeperRegistry main contract
   */
  function migrateUpkeeps(uint256[] calldata ids, address destination) external {
    if (
      s_peerRegistryMigrationPermission[destination] != MigrationPermission.OUTGOING &&
      s_peerRegistryMigrationPermission[destination] != MigrationPermission.BIDIRECTIONAL
    ) revert MigrationNotPermitted();
    if (s_transcoder == ZERO_ADDRESS) revert TranscoderNotSet();
    if (ids.length == 0) revert ArrayHasNoEntries();
    uint256 id;
    Upkeep memory upkeep;
    uint256 totalBalanceRemaining;
    bytes[] memory checkDatas = new bytes[](ids.length);
    Upkeep[] memory upkeeps = new Upkeep[](ids.length);
    for (uint256 idx = 0; idx < ids.length; idx++) {
      id = ids[idx];
      upkeep = s_upkeep[id];
      requireAdminAndNotCancelled(upkeep);
      upkeeps[idx] = upkeep;
      checkDatas[idx] = s_checkData[id];
      totalBalanceRemaining = totalBalanceRemaining + upkeep.balance;
      delete s_upkeep[id];
      delete s_checkData[id];
      // nullify existing proposed admin change if an upkeep is being migrated
      delete s_proposedAdmin[id];
      s_upkeepIDs.remove(id);
      emit UpkeepMigrated(id, upkeep.balance, destination);
    }
    s_expectedLinkBalance = s_expectedLinkBalance - totalBalanceRemaining;
    bytes memory encodedUpkeeps = abi.encode(ids, upkeeps, checkDatas);
    MigratableKeeperRegistryInterface(destination).receiveUpkeeps(
      UpkeepTranscoderInterface(s_transcoder).transcodeUpkeeps(
        UPKEEP_TRANSCODER_VERSION_BASE,
        MigratableKeeperRegistryInterface(destination).upkeepTranscoderVersion(),
        encodedUpkeeps
      )
    );
    LINK.transfer(destination, totalBalanceRemaining);
  }

  /**
   * @dev Called through KeeperRegistry main contract
   */
  function receiveUpkeeps(bytes calldata encodedUpkeeps) external {
    if (
      s_peerRegistryMigrationPermission[msg.sender] != MigrationPermission.INCOMING &&
      s_peerRegistryMigrationPermission[msg.sender] != MigrationPermission.BIDIRECTIONAL
    ) revert MigrationNotPermitted();
    (uint256[] memory ids, Upkeep[] memory upkeeps, bytes[] memory checkDatas) = abi.decode(
      encodedUpkeeps,
      (uint256[], Upkeep[], bytes[])
    );
    for (uint256 idx = 0; idx < ids.length; idx++) {
      _createUpkeep(
        ids[idx],
        upkeeps[idx].target,
        upkeeps[idx].executeGas,
        upkeeps[idx].admin,
        upkeeps[idx].balance,
        checkDatas[idx],
        upkeeps[idx].paused
      );
      emit UpkeepReceived(ids[idx], upkeeps[idx].balance, msg.sender);
    }
  }

  /**
   * @notice creates a new upkeep with the given fields
   * @param target address to perform upkeep on
   * @param gasLimit amount of gas to provide the target contract when
   * performing upkeep
   * @param admin address to cancel upkeep and withdraw remaining funds
   * @param checkData data passed to the contract when checking for upkeep
   * @param paused if this upkeep is paused
   */
  function _createUpkeep(
    uint256 id,
    address target,
    uint32 gasLimit,
    address admin,
    uint96 balance,
    bytes memory checkData,
    bool paused
  ) internal whenNotPaused {
    if (!target.isContract()) revert NotAContract();
    if (gasLimit < PERFORM_GAS_MIN || gasLimit > s_storage.maxPerformGas) revert GasLimitOutsideRange();
    s_upkeep[id] = Upkeep({
      target: target,
      executeGas: gasLimit,
      balance: balance,
      admin: admin,
      maxValidBlocknumber: UINT32_MAX,
      lastKeeper: ZERO_ADDRESS,
      amountSpent: 0,
      paused: paused
    });
    s_expectedLinkBalance = s_expectedLinkBalance + balance;
    s_checkData[id] = checkData;
    s_upkeepIDs.add(id);
  }
}


/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\dev\KeeperRegistry1_3.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity 0.8.6;

////import "@openzeppelin/contracts/proxy/Proxy.sol";
////import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
////import "@openzeppelin/contracts/utils/Address.sol";
////import "./KeeperRegistryBase.sol";
////import "./KeeperRegistryLogic1_3.sol";
////import {KeeperRegistryExecutableInterface} from "./interfaces/KeeperRegistryInterface1_3.sol";
////import "../interfaces/MigratableKeeperRegistryInterface.sol";
////import "../interfaces/TypeAndVersionInterface.sol";
////import "../interfaces/ERC677ReceiverInterface.sol";

/**
 * @notice Registry for adding work for Chainlink Keepers to perform on client
 * contracts. Clients must support the Upkeep interface.
 */
contract KeeperRegistry1_3 is
  KeeperRegistryBase,
  Proxy,
  TypeAndVersionInterface,
  KeeperRegistryExecutableInterface,
  MigratableKeeperRegistryInterface,
  ERC677ReceiverInterface
{
  using Address for address;
  using EnumerableSet for EnumerableSet.UintSet;

  address public immutable KEEPER_REGISTRY_LOGIC;

  /**
   * @notice versions:
   * - KeeperRegistry 1.3.0: split contract into Proxy and Logic
   *                       : account for Arbitrum and Optimism L1 gas fee
   *                       : allow users to configure upkeeps
   * - KeeperRegistry 1.2.0: allow funding within performUpkeep
   *                       : allow configurable registry maxPerformGas
   *                       : add function to let admin change upkeep gas limit
   *                       : add minUpkeepSpend requirement
                           : upgrade to solidity v0.8
   * - KeeperRegistry 1.1.0: added flatFeeMicroLink
   * - KeeperRegistry 1.0.0: initial release
   */
  string public constant override typeAndVersion = "KeeperRegistry 1.3.0";

  /**
   * @param keeperRegistryLogic the address of keeper registry logic
   * @param config registry config settings
   */
  constructor(KeeperRegistryLogic1_3 keeperRegistryLogic, Config memory config)
    KeeperRegistryBase(
      keeperRegistryLogic.PAYMENT_MODEL(),
      keeperRegistryLogic.REGISTRY_GAS_OVERHEAD(),
      address(keeperRegistryLogic.LINK()),
      address(keeperRegistryLogic.LINK_ETH_FEED()),
      address(keeperRegistryLogic.FAST_GAS_FEED())
    )
  {
    KEEPER_REGISTRY_LOGIC = address(keeperRegistryLogic);
    setConfig(config);
  }

  // ACTIONS

  /**
   * @notice adds a new upkeep
   * @param target address to perform upkeep on
   * @param gasLimit amount of gas to provide the target contract when
   * performing upkeep
   * @param admin address to cancel upkeep and withdraw remaining funds
   * @param checkData data passed to the contract when checking for upkeep
   */
  function registerUpkeep(
    address target,
    uint32 gasLimit,
    address admin,
    bytes calldata checkData
  ) external override returns (uint256 id) {
    // Executed through logic contract
    _fallback();
  }

  /**
   * @notice simulated by keepers via eth_call to see if the upkeep needs to be
   * performed. If upkeep is needed, the call then simulates performUpkeep
   * to make sure it succeeds. Finally, it returns the success status along with
   * payment information and the perform data payload.
   * @param id identifier of the upkeep to check
   * @param from the address to simulate performing the upkeep from
   */
  function checkUpkeep(uint256 id, address from)
    external
    override
    cannotExecute
    returns (
      bytes memory performData,
      uint256 maxLinkPayment,
      uint256 gasLimit,
      uint256 adjustedGasWei,
      uint256 linkEth
    )
  {
    // Executed through logic contract
    _fallback();
  }

  /**
   * @notice executes the upkeep with the perform data returned from
   * checkUpkeep, validates the keeper's permissions, and pays the keeper.
   * @param id identifier of the upkeep to execute the data with.
   * @param performData calldata parameter to be passed to the target upkeep.
   */
  function performUpkeep(uint256 id, bytes calldata performData)
    external
    override
    whenNotPaused
    returns (bool success)
  {
    return _performUpkeepWithParams(_generatePerformParams(msg.sender, id, performData, true));
  }

  /**
   * @notice prevent an upkeep from being performed in the future
   * @param id upkeep to be canceled
   */
  function cancelUpkeep(uint256 id) external override {
    // Executed through logic contract
    _fallback();
  }

  /**
   * @notice pause an upkeep
   * @param id upkeep to be paused
   */
  function pauseUpkeep(uint256 id) external override {
    Upkeep memory upkeep = s_upkeep[id];
    requireAdminAndNotCancelled(upkeep);
    if (upkeep.paused) revert OnlyUnpausedUpkeep();
    s_upkeep[id].paused = true;
    s_upkeepIDs.remove(id);
    emit UpkeepPaused(id);
  }

  /**
   * @notice unpause an upkeep
   * @param id upkeep to be resumed
   */
  function unpauseUpkeep(uint256 id) external override {
    Upkeep memory upkeep = s_upkeep[id];
    requireAdminAndNotCancelled(upkeep);
    if (!upkeep.paused) revert OnlyPausedUpkeep();
    s_upkeep[id].paused = false;
    s_upkeepIDs.add(id);
    emit UpkeepUnpaused(id);
  }

  /**
   * @notice update the check data of an upkeep
   * @param id the id of the upkeep whose check data needs to be updated
   * @param newCheckData the new check data
   */
  function updateCheckData(uint256 id, bytes calldata newCheckData) external override {
    Upkeep memory upkeep = s_upkeep[id];
    requireAdminAndNotCancelled(upkeep);
    s_checkData[id] = newCheckData;
    emit UpkeepCheckDataUpdated(id, newCheckData);
  }

  /**
   * @notice adds LINK funding for an upkeep by transferring from the sender's
   * LINK balance
   * @param id upkeep to fund
   * @param amount number of LINK to transfer
   */
  function addFunds(uint256 id, uint96 amount) external override {
    // Executed through logic contract
    _fallback();
  }

  /**
   * @notice uses LINK's transferAndCall to LINK and add funding to an upkeep
   * @dev safe to cast uint256 to uint96 as total LINK supply is under UINT96MAX
   * @param sender the account which transferred the funds
   * @param amount number of LINK transfer
   */
  function onTokenTransfer(
    address sender,
    uint256 amount,
    bytes calldata data
  ) external override {
    if (msg.sender != address(LINK)) revert OnlyCallableByLINKToken();
    if (data.length != 32) revert InvalidDataLength();
    uint256 id = abi.decode(data, (uint256));
    if (s_upkeep[id].maxValidBlocknumber != UINT32_MAX) revert UpkeepCancelled();

    s_upkeep[id].balance = s_upkeep[id].balance + uint96(amount);
    s_expectedLinkBalance = s_expectedLinkBalance + amount;

    emit FundsAdded(id, sender, uint96(amount));
  }

  /**
   * @notice removes funding from a canceled upkeep
   * @param id upkeep to withdraw funds from
   * @param to destination address for sending remaining funds
   */
  function withdrawFunds(uint256 id, address to) external {
    // Executed through logic contract
    _fallback();
  }

  /**
   * @notice withdraws LINK funds collected through cancellation fees
   */
  function withdrawOwnerFunds() external {
    // Executed through logic contract
    _fallback();
  }

  /**
   * @notice allows the admin of an upkeep to modify gas limit
   * @param id upkeep to be change the gas limit for
   * @param gasLimit new gas limit for the upkeep
   */
  function setUpkeepGasLimit(uint256 id, uint32 gasLimit) external override {
    // Executed through logic contract
    _fallback();
  }

  /**
   * @notice recovers LINK funds improperly transferred to the registry
   * @dev In principle this function’s execution cost could exceed block
   * gas limit. However, in our anticipated deployment, the number of upkeeps and
   * keepers will be low enough to avoid this problem.
   */
  function recoverFunds() external {
    // Executed through logic contract
    _fallback();
  }

  /**
   * @notice withdraws a keeper's payment, callable only by the keeper's payee
   * @param from keeper address
   * @param to address to send the payment to
   */
  function withdrawPayment(address from, address to) external {
    // Executed through logic contract
    _fallback();
  }

  /**
   * @notice proposes the safe transfer of a keeper's payee to another address
   * @param keeper address of the keeper to transfer payee role
   * @param proposed address to nominate for next payeeship
   */
  function transferPayeeship(address keeper, address proposed) external {
    // Executed through logic contract
    _fallback();
  }

  /**
   * @notice accepts the safe transfer of payee role for a keeper
   * @param keeper address to accept the payee role for
   */
  function acceptPayeeship(address keeper) external {
    // Executed through logic contract
    _fallback();
  }

  /**
   * @notice proposes the safe transfer of an upkeep's admin role to another address
   * @param id the upkeep id to transfer admin
   * @param proposed address to nominate for the new upkeep admin
   */
  function transferUpkeepAdmin(uint256 id, address proposed) external override {
    // Executed through logic contract
    _fallback();
  }

  /**
   * @notice accepts the safe transfer of admin role for an upkeep
   * @param id the upkeep id
   */
  function acceptUpkeepAdmin(uint256 id) external override {
    // Executed through logic contract
    _fallback();
  }

  /**
   * @notice signals to keepers that they should not perform upkeeps until the
   * contract has been unpaused
   */
  function pause() external {
    // Executed through logic contract
    _fallback();
  }

  /**
   * @notice signals to keepers that they can perform upkeeps once again after
   * having been paused
   */
  function unpause() external {
    // Executed through logic contract
    _fallback();
  }

  // SETTERS

  /**
   * @notice updates the configuration of the registry
   * @param config registry config fields
   */
  function setConfig(Config memory config) public onlyOwner {
    if (config.maxPerformGas < s_storage.maxPerformGas) revert GasLimitCanOnlyIncrease();
    s_storage = Storage({
      paymentPremiumPPB: config.paymentPremiumPPB,
      flatFeeMicroLink: config.flatFeeMicroLink,
      blockCountPerTurn: config.blockCountPerTurn,
      checkGasLimit: config.checkGasLimit,
      stalenessSeconds: config.stalenessSeconds,
      gasCeilingMultiplier: config.gasCeilingMultiplier,
      minUpkeepSpend: config.minUpkeepSpend,
      maxPerformGas: config.maxPerformGas,
      nonce: s_storage.nonce
    });
    s_fallbackGasPrice = config.fallbackGasPrice;
    s_fallbackLinkPrice = config.fallbackLinkPrice;
    s_transcoder = config.transcoder;
    s_registrar = config.registrar;
    emit ConfigSet(config);
  }

  /**
   * @notice update the list of keepers allowed to perform upkeep
   * @param keepers list of addresses allowed to perform upkeep
   * @param payees addresses corresponding to keepers who are allowed to
   * move payments which have been accrued
   */
  function setKeepers(address[] calldata keepers, address[] calldata payees) external {
    // Executed through logic contract
    _fallback();
  }

  // GETTERS

  /**
   * @notice read all of the details about an upkeep
   */
  function getUpkeep(uint256 id)
    external
    view
    override
    returns (
      address target,
      uint32 executeGas,
      bytes memory checkData,
      uint96 balance,
      address lastKeeper,
      address admin,
      uint64 maxValidBlocknumber,
      uint96 amountSpent,
      bool paused
    )
  {
    Upkeep memory reg = s_upkeep[id];
    return (
      reg.target,
      reg.executeGas,
      s_checkData[id],
      reg.balance,
      reg.lastKeeper,
      reg.admin,
      reg.maxValidBlocknumber,
      reg.amountSpent,
      reg.paused
    );
  }

  /**
   * @notice retrieve active upkeep IDs. Active upkeep is defined as an upkeep which is not paused and not canceled.
   * @param startIndex starting index in list
   * @param maxCount max count to retrieve (0 = unlimited)
   * @dev the order of IDs in the list is **not guaranteed**, therefore, if making successive calls, one
   * should consider keeping the blockheight constant to ensure a holistic picture of the contract state
   */
  function getActiveUpkeepIDs(uint256 startIndex, uint256 maxCount) external view override returns (uint256[] memory) {
    uint256 maxIdx = s_upkeepIDs.length();
    if (startIndex >= maxIdx) revert IndexOutOfRange();
    if (maxCount == 0) {
      maxCount = maxIdx - startIndex;
    }
    uint256[] memory ids = new uint256[](maxCount);
    for (uint256 idx = 0; idx < maxCount; idx++) {
      ids[idx] = s_upkeepIDs.at(startIndex + idx);
    }
    return ids;
  }

  /**
   * @notice read the current info about any keeper address
   */
  function getKeeperInfo(address query)
    external
    view
    override
    returns (
      address payee,
      bool active,
      uint96 balance
    )
  {
    KeeperInfo memory keeper = s_keeperInfo[query];
    return (keeper.payee, keeper.active, keeper.balance);
  }

  /**
   * @notice read the current state of the registry
   */
  function getState()
    external
    view
    override
    returns (
      State memory state,
      Config memory config,
      address[] memory keepers
    )
  {
    Storage memory store = s_storage;
    state.nonce = store.nonce;
    state.ownerLinkBalance = s_ownerLinkBalance;
    state.expectedLinkBalance = s_expectedLinkBalance;
    state.numUpkeeps = s_upkeepIDs.length();
    config.paymentPremiumPPB = store.paymentPremiumPPB;
    config.flatFeeMicroLink = store.flatFeeMicroLink;
    config.blockCountPerTurn = store.blockCountPerTurn;
    config.checkGasLimit = store.checkGasLimit;
    config.stalenessSeconds = store.stalenessSeconds;
    config.gasCeilingMultiplier = store.gasCeilingMultiplier;
    config.minUpkeepSpend = store.minUpkeepSpend;
    config.maxPerformGas = store.maxPerformGas;
    config.fallbackGasPrice = s_fallbackGasPrice;
    config.fallbackLinkPrice = s_fallbackLinkPrice;
    config.transcoder = s_transcoder;
    config.registrar = s_registrar;
    return (state, config, s_keeperList);
  }

  /**
   * @notice calculates the minimum balance required for an upkeep to remain eligible
   * @param id the upkeep id to calculate minimum balance for
   */
  function getMinBalanceForUpkeep(uint256 id) external view returns (uint96 minBalance) {
    return getMaxPaymentForGas(s_upkeep[id].executeGas);
  }

  /**
   * @notice calculates the maximum payment for a given gas limit
   * @param gasLimit the gas to calculate payment for
   */
  function getMaxPaymentForGas(uint256 gasLimit) public view returns (uint96 maxPayment) {
    (uint256 fastGasWei, uint256 linkEth) = _getFeedData();
    return _calculatePaymentAmount(gasLimit, fastGasWei, linkEth, false);
  }

  /**
   * @notice retrieves the migration permission for a peer registry
   */
  function getPeerRegistryMigrationPermission(address peer) external view returns (MigrationPermission) {
    return s_peerRegistryMigrationPermission[peer];
  }

  /**
   * @notice sets the peer registry migration permission
   */
  function setPeerRegistryMigrationPermission(address peer, MigrationPermission permission) external {
    // Executed through logic contract
    _fallback();
  }

  /**
   * @inheritdoc MigratableKeeperRegistryInterface
   */
  function migrateUpkeeps(uint256[] calldata ids, address destination) external override {
    // Executed through logic contract
    _fallback();
  }

  /**
   * @inheritdoc MigratableKeeperRegistryInterface
   */
  UpkeepFormat public constant override upkeepTranscoderVersion = UPKEEP_TRANSCODER_VERSION_BASE;

  /**
   * @inheritdoc MigratableKeeperRegistryInterface
   */
  function receiveUpkeeps(bytes calldata encodedUpkeeps) external override {
    // Executed through logic contract
    _fallback();
  }

  /**
   * @dev This is the address to which proxy functions are delegated to
   */
  function _implementation() internal view override returns (address) {
    return KEEPER_REGISTRY_LOGIC;
  }

  /**
   * @dev calls target address with exactly gasAmount gas and data as calldata
   * or reverts if at least gasAmount gas is not available
   */
  function _callWithExactGas(
    uint256 gasAmount,
    address target,
    bytes memory data
  ) private returns (bool success) {
    assembly {
      let g := gas()
      // Compute g -= PERFORM_GAS_CUSHION and check for underflow
      if lt(g, PERFORM_GAS_CUSHION) {
        revert(0, 0)
      }
      g := sub(g, PERFORM_GAS_CUSHION)
      // if g - g//64 <= gasAmount, revert
      // (we subtract g//64 because of EIP-150)
      if iszero(gt(sub(g, div(g, 64)), gasAmount)) {
        revert(0, 0)
      }
      // solidity calls check that a contract actually exists at the destination, so we do the same
      if iszero(extcodesize(target)) {
        revert(0, 0)
      }
      // call and return whether we succeeded. ignore return data
      success := call(gasAmount, target, 0, add(data, 0x20), mload(data), 0, 0)
    }
    return success;
  }

  /**
   * @dev calls the Upkeep target with the performData param passed in by the
   * keeper and the exact gas required by the Upkeep
   */
  function _performUpkeepWithParams(PerformParams memory params) private nonReentrant returns (bool success) {
    Upkeep memory upkeep = s_upkeep[params.id];
    if (upkeep.maxValidBlocknumber <= block.number) revert UpkeepCancelled();
    _prePerformUpkeep(upkeep, params.from, params.maxLinkPayment);

    uint256 gasUsed = gasleft();
    bytes memory callData = abi.encodeWithSelector(PERFORM_SELECTOR, params.performData);
    success = _callWithExactGas(params.gasLimit, upkeep.target, callData);
    gasUsed = gasUsed - gasleft();
    uint96 payment = _calculatePaymentAmount(gasUsed, params.fastGasWei, params.linkEth, true);

    s_upkeep[params.id].balance = s_upkeep[params.id].balance - payment;
    s_upkeep[params.id].amountSpent = s_upkeep[params.id].amountSpent + payment;
    s_upkeep[params.id].lastKeeper = params.from;
    s_keeperInfo[params.from].balance = s_keeperInfo[params.from].balance + payment;

    emit UpkeepPerformed(params.id, success, params.from, payment, params.performData);
    return success;
  }
}

