
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\polys\main\proposal\MultiSigProposalImplementation.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity 0.8.19;
////import "contracts/polygon/abstract/governance/proposal/MultiSigProposal.sol";
////import "contracts/polygon/abstract/utils/AddressBook.sol";
////import "contracts/polygon/interfaces/main/proposal/IReferendumProposalFactory.sol";

contract MultiSigProposalImplementation is MultiSigProposal, AddressBook {

    /**
    * @dev Emitted when the terminal address is set.
    * @param account The address of the new terminal.
    */
    event TerminalSet(address indexed account);

    /**
    * @dev Emitted when the MultiSigProposalFactory address is set.
    * @param account The address of the new MultiSigProposalFactory.
    */
    event MultiSigProposalFactorySet(address indexed account);

    /**
    * @dev Emitted when the ReferendumProposalFactory address is set.
    * @param account The address of the new ReferendumProposalFactory.
    */
    event ReferendumProposalFactorySet(address indexed account);

    /**
    * @dev Executes the MultiSigProposal and triggers additional actions.
    * Calls the internal _execute function to mark the proposal as executed.
    * Emits an Executed event.
    * TODO: Create another referendum proposal using the ReferendumProposalFactory.
    */
    function execute() public virtual returns (address) {
        _execute();
        IReferendumProposalFactory factory = IReferendumProposalFactory(referendumProposalFactory());
        return factory.createReferendumProposal(caption(), message(), target(), data());
    }

    /**
    * @dev Sets the address of the terminal associated with the MultiSigProposalFactory.
    * Only the owner is allowed to perform this action.
    * @param account The address of the new terminal.
    */
    function setTerminal(address account) public virtual {
        _onlyOwner();
        _setTerminal(account);
    }

    /**
    * @dev Sets the address of the MultiSigProposalFactory associated with the MultiSigProposalFactory.
    * Only the owner is allowed to perform this action.
    * @param account The address of the new MultiSigProposalFactory.
    */
    function setMultiSigProposalFactory(address account) public virtual {
        _onlyOwner();
        _setMultiSigProposalFactory(account);
    }

    /**
    * @dev Sets the address of the ReferendumProposalFactory associated with the MultiSigProposalFactory.
    * Only the owner is allowed to perform this action.
    * @param account The address of the new ReferendumProposalFactory.
    */
    function setReferendumProposalFactory(address account) public virtual {
        _onlyOwner();
        _setReferendumProposalFactory(account);
    }

    /**
    * @dev Sets the address of the terminal internally, invoking the parent function and emitting a TerminalSet event.
    * @param account The address of the new terminal.
    */
    function _setTerminal(address account) internal virtual override {
        super._setTerminal(account);
        emit TerminalSet(account);
    }

    /**
    * @dev Sets the address of the MultiSigProposalFactory internally, invoking the parent function and emitting a MultiSigProposalFactorySet event.
    * @param account The address of the new MultiSigProposalFactory.
    */
    function _setMultiSigProposalFactory(address account) internal virtual override {
        super._setMultiSigProposalFactory(account);
        emit MultiSigProposalFactorySet(account);
    }

    /**
    * @dev Sets the address of the ReferendumProposalFactory internally, invoking the parent function and emitting a ReferendumProposalFactorySet event.
    * @param account The address of the new ReferendumProposalFactory.
    */
    function _setReferendumProposalFactory(address account) internal virtual override {
        super._setReferendumProposalFactory(account);
        emit ReferendumProposalFactorySet(account);
    }
}
