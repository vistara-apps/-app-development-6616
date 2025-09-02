// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DAOGovernance
 * @dev A contract for DAO governance with proposal creation and voting
 */
contract DAOGovernance is Ownable, ReentrancyGuard {
    // Proposal struct
    struct Proposal {
        string title;
        string description;
        address creator;
        uint256 creationTime;
        uint256 endTime;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 quorum;
        bool executed;
        bool canceled;
        mapping(address => Vote) votes;
    }

    // Vote struct
    struct Vote {
        bool hasVoted;
        bool support;
        uint256 votingPower;
    }

    // Proposal summary for external view
    struct ProposalSummary {
        uint256 id;
        string title;
        string description;
        address creator;
        uint256 creationTime;
        uint256 endTime;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 quorum;
        bool executed;
        bool canceled;
    }

    // Token used for voting
    IERC20 public governanceToken;

    // Proposals
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;

    // Voting delay and period
    uint256 public votingDelay;
    uint256 public votingPeriod;

    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed creator,
        string title,
        uint256 endTime,
        uint256 quorum
    );
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 votingPower
    );
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCanceled(uint256 indexed proposalId);

    /**
     * @dev Constructor
     * @param _governanceToken The token used for voting
     * @param _votingDelay The delay before voting starts (in seconds)
     * @param _votingPeriod The duration of the voting period (in seconds)
     */
    constructor(
        address _governanceToken,
        uint256 _votingDelay,
        uint256 _votingPeriod
    ) Ownable(msg.sender) {
        require(_governanceToken != address(0), "DAOGovernance: token is zero address");
        governanceToken = IERC20(_governanceToken);
        votingDelay = _votingDelay;
        votingPeriod = _votingPeriod;
    }

    /**
     * @dev Creates a new proposal
     * @param _title The title of the proposal
     * @param _description The description of the proposal
     * @param _quorum The minimum number of votes required for the proposal to pass
     * @return The ID of the newly created proposal
     */
    function createProposal(
        string memory _title,
        string memory _description,
        uint256 _quorum
    ) public returns (uint256) {
        require(
            governanceToken.balanceOf(msg.sender) > 0,
            "DAOGovernance: must hold governance tokens to create proposal"
        );

        uint256 proposalId = proposalCount;
        Proposal storage proposal = proposals[proposalId];
        proposal.title = _title;
        proposal.description = _description;
        proposal.creator = msg.sender;
        proposal.creationTime = block.timestamp;
        proposal.endTime = block.timestamp + votingDelay + votingPeriod;
        proposal.quorum = _quorum;
        proposal.executed = false;
        proposal.canceled = false;

        proposalCount++;
        emit ProposalCreated(proposalId, msg.sender, _title, proposal.endTime, _quorum);
        return proposalId;
    }

    /**
     * @dev Casts a vote on a proposal
     * @param _proposalId The ID of the proposal to vote on
     * @param _support Whether to support the proposal
     */
    function castVote(uint256 _proposalId, bool _support) public nonReentrant {
        require(_proposalId < proposalCount, "DAOGovernance: proposal does not exist");
        Proposal storage proposal = proposals[_proposalId];
        
        require(
            block.timestamp >= proposal.creationTime + votingDelay,
            "DAOGovernance: voting has not started yet"
        );
        require(
            block.timestamp <= proposal.endTime,
            "DAOGovernance: voting has ended"
        );
        require(
            !proposal.executed && !proposal.canceled,
            "DAOGovernance: proposal already executed or canceled"
        );
        require(
            !proposal.votes[msg.sender].hasVoted,
            "DAOGovernance: already voted"
        );

        uint256 votingPower = governanceToken.balanceOf(msg.sender);
        require(votingPower > 0, "DAOGovernance: must hold governance tokens to vote");

        proposal.votes[msg.sender] = Vote({
            hasVoted: true,
            support: _support,
            votingPower: votingPower
        });

        if (_support) {
            proposal.votesFor += votingPower;
        } else {
            proposal.votesAgainst += votingPower;
        }

        emit VoteCast(_proposalId, msg.sender, _support, votingPower);
    }

    /**
     * @dev Executes a proposal if it has passed
     * @param _proposalId The ID of the proposal to execute
     */
    function executeProposal(uint256 _proposalId) public {
        require(_proposalId < proposalCount, "DAOGovernance: proposal does not exist");
        Proposal storage proposal = proposals[_proposalId];
        
        require(
            block.timestamp > proposal.endTime,
            "DAOGovernance: voting has not ended yet"
        );
        require(
            !proposal.executed && !proposal.canceled,
            "DAOGovernance: proposal already executed or canceled"
        );
        require(
            proposal.votesFor + proposal.votesAgainst >= proposal.quorum,
            "DAOGovernance: quorum not reached"
        );
        require(
            proposal.votesFor > proposal.votesAgainst,
            "DAOGovernance: proposal did not pass"
        );

        proposal.executed = true;
        emit ProposalExecuted(_proposalId);
    }

    /**
     * @dev Cancels a proposal
     * @param _proposalId The ID of the proposal to cancel
     */
    function cancelProposal(uint256 _proposalId) public {
        require(_proposalId < proposalCount, "DAOGovernance: proposal does not exist");
        Proposal storage proposal = proposals[_proposalId];
        
        require(
            msg.sender == proposal.creator || msg.sender == owner(),
            "DAOGovernance: not authorized"
        );
        require(
            !proposal.executed && !proposal.canceled,
            "DAOGovernance: proposal already executed or canceled"
        );

        proposal.canceled = true;
        emit ProposalCanceled(_proposalId);
    }

    /**
     * @dev Gets the state of a proposal
     * @param _proposalId The ID of the proposal
     * @return The state of the proposal (0: Pending, 1: Active, 2: Succeeded, 3: Failed, 4: Executed, 5: Canceled)
     */
    function getProposalState(uint256 _proposalId) public view returns (uint8) {
        require(_proposalId < proposalCount, "DAOGovernance: proposal does not exist");
        Proposal storage proposal = proposals[_proposalId];
        
        if (proposal.canceled) {
            return 5; // Canceled
        }
        if (proposal.executed) {
            return 4; // Executed
        }
        if (block.timestamp <= proposal.creationTime + votingDelay) {
            return 0; // Pending
        }
        if (block.timestamp <= proposal.endTime) {
            return 1; // Active
        }
        if (proposal.votesFor + proposal.votesAgainst < proposal.quorum) {
            return 3; // Failed (quorum not reached)
        }
        if (proposal.votesFor > proposal.votesAgainst) {
            return 2; // Succeeded
        }
        return 3; // Failed
    }

    /**
     * @dev Gets a summary of a proposal
     * @param _proposalId The ID of the proposal
     * @return A summary of the proposal
     */
    function getProposalSummary(uint256 _proposalId) public view returns (ProposalSummary memory) {
        require(_proposalId < proposalCount, "DAOGovernance: proposal does not exist");
        Proposal storage proposal = proposals[_proposalId];
        
        return ProposalSummary({
            id: _proposalId,
            title: proposal.title,
            description: proposal.description,
            creator: proposal.creator,
            creationTime: proposal.creationTime,
            endTime: proposal.endTime,
            votesFor: proposal.votesFor,
            votesAgainst: proposal.votesAgainst,
            quorum: proposal.quorum,
            executed: proposal.executed,
            canceled: proposal.canceled
        });
    }

    /**
     * @dev Gets all proposals
     * @return An array of proposal summaries
     */
    function getAllProposals() public view returns (ProposalSummary[] memory) {
        ProposalSummary[] memory allProposals = new ProposalSummary[](proposalCount);
        for (uint256 i = 0; i < proposalCount; i++) {
            allProposals[i] = getProposalSummary(i);
        }
        return allProposals;
    }

    /**
     * @dev Gets the vote of a user on a proposal
     * @param _proposalId The ID of the proposal
     * @param _voter The address of the voter
     * @return Whether the user has voted, whether they supported the proposal, and their voting power
     */
    function getVote(uint256 _proposalId, address _voter) public view returns (bool, bool, uint256) {
        require(_proposalId < proposalCount, "DAOGovernance: proposal does not exist");
        Vote memory vote = proposals[_proposalId].votes[_voter];
        return (vote.hasVoted, vote.support, vote.votingPower);
    }

    /**
     * @dev Updates the voting delay
     * @param _votingDelay The new voting delay
     */
    function setVotingDelay(uint256 _votingDelay) public onlyOwner {
        votingDelay = _votingDelay;
    }

    /**
     * @dev Updates the voting period
     * @param _votingPeriod The new voting period
     */
    function setVotingPeriod(uint256 _votingPeriod) public onlyOwner {
        votingPeriod = _votingPeriod;
    }
}

