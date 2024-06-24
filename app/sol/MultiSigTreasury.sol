// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IToken } from "./IToken.sol";
import { Result, Ok, Err } from "./Result.sol";
import { FixedPointMath } from "./FixedPointMath.sol";

struct Proposal {
    bool success;
    address[] signers;
    address[] signed;
    address token;
    address to;
    uint256 amount;
    uint32 deadline;
}

contract MultiSigTreasury {
    using FixedPointMath for uint256;

    event ProposalCreation(string memory proposalName, address indexed token, address indexed to, uint256 amount);
    event Pass(string memory proposalName, address indexed token, address indexed to, uint256 amount);

    address[] private _signers;
    mapping(string => Proposal) private _proposals;

    constructor(address[] memory signers) {
        for (uint256 i = 0; i < signers.length; i += 1) {
            address signer = signers[i];
            _signers.push(signer);
        }
    }

    function balance(address token) public view returns (Result memory, uint256) {
        IToken tokenIntf = IToken(token);
        uint8 decimals;
        {
            try tokenIntf.decimals() returns (uint8 x) {
                decimals = x;
            }
            catch {
                return (Err(""), 0);
            }
        }
        uint256 balanceN;
        {
            try tokenIntf.balanceOf(address(this)) returns (uint256 x) {
                balance = x;
            }
            catch {
                return (Err(""), 0);
            }
        }
        return balanceN.cast(decimals, 18);
    }

    function addSigner(address account) public returns (Result memory) {
        {
            bool success;
            Proposal storage proposal = _proposals[proposalName];
            for (uint256 i = 0; i < proposal.signers.length; i += 1) {
                address signer = proposal.signers[i];
                if (msg.sender == signer) {
                    revert("NOT_SIGNER");
                }
                if (account == signer) {
                    revert("ALREADY_SIGNER");
                }
            }
            if (!success) {
                revert("NOT_SIGNER");
            }
        }

    }

    function propose(string memory proposalName, address token, address to, uint256 amount) public returns (Result) {
        Proposal storage proposal = _proposals[proposalName];
        proposal.success = false;
        for (uint256 i = 0; i < _signers.length; i += 1) {
            address signer = _signers[i];
            proposal.signers.push(signer);
        }
        proposal.token = token;
        proposal.to = to;
        proposal.amount = amount;
        proposal.deadline = block.timestamp + 7 days;
        emit ProposalCreation(proposalName, token, to, amount);
        return Ok();
    }

    function sign(string memory proposalName) public returns (Result memory) {
        Proposal storage proposal = _proposals[proposalName];
        {
            bool success;
            Proposal storage proposal = _proposals[proposalName];
            for (uint256 i = 0; i < proposal.signers.length; i += 1) {
                address signer = proposal.signers[i];
                if (msg.sender == signer) {
                    success = true;
                    break;
                }
            }
            if (!success) {
                revert("NOT_SIGNER");
            }
        }
        {
            bool success;
            Proposal storage proposal = _proposals[proposalName];
            for (uint256 i = 0; i < proposal.signed.length; i += 1) {
                address signer = proposal.signed[i];
                if (msg.sender == signer) {
                    success = true;
                    break;
                }
            }
            if (success) {
                revert("ALREADY_SIGNED");
            }
        }
        proposal.signed.push(msg.sender);
        if (proposal.signed.length == proposal.signers.length && block.timestamp < proposal.deadline) {
            emit Pass(proposalName, token, to, amount);
        }
        return Ok();
    }
}