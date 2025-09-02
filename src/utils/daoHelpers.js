import { createPublicClient, http, createWalletClient, parseEther, formatEther } from 'viem';
import { base } from 'viem/chains';

// ABI imports (these would be generated from the compiled contracts)
import DAOGovernanceABI from '../abi/DAOGovernance.json';
import ERC20TokenABI from '../abi/ERC20Token.json';

// Contract addresses (these would be set based on deployment environment)
const CONTRACT_ADDRESSES = {
  development: {
    daoGovernance: '0x...',
  },
  production: {
    daoGovernance: '0x...',
  }
};

// Get the appropriate contract addresses based on environment
const getContractAddresses = () => {
  const env = import.meta.env.MODE || 'development';
  return CONTRACT_ADDRESSES[env];
};

// Create a public client for reading from the blockchain
export const createClient = () => {
  return createPublicClient({
    chain: base,
    transport: http()
  });
};

// Create a wallet client for writing to the blockchain
export const createWallet = (walletClient) => {
  if (!walletClient) {
    throw new Error('Wallet client is required');
  }
  return walletClient;
};

/**
 * Create a new proposal
 * @param {object} walletClient - The wallet client
 * @param {object} proposalConfig - The proposal configuration
 * @returns {Promise<number>} - The ID of the created proposal
 */
export const createProposal = async (walletClient, proposalConfig) => {
  try {
    const { title, description, quorum } = proposalConfig;
    const wallet = createWallet(walletClient);
    const publicClient = createClient();
    const addresses = getContractAddresses();

    // Create proposal
    const hash = await wallet.writeContract({
      address: addresses.daoGovernance,
      abi: DAOGovernanceABI,
      functionName: 'createProposal',
      args: [
        title,
        description,
        parseEther(quorum)
      ]
    });

    // Wait for transaction to be mined
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    // Extract proposal ID from logs
    const event = receipt.logs.find(
      log => log.topics[0] === '0x...' // ProposalCreated event signature
    );

    if (!event) {
      throw new Error('Proposal creation event not found in transaction logs');
    }

    // Parse the event to get the proposal ID
    const proposalId = parseInt(event.topics[1], 16);
    return proposalId;
  } catch (error) {
    console.error('Error creating proposal:', error);
    throw error;
  }
};

/**
 * Cast a vote on a proposal
 * @param {object} walletClient - The wallet client
 * @param {number} proposalId - The proposal ID
 * @param {boolean} support - Whether to support the proposal
 * @returns {Promise<string>} - The transaction hash
 */
export const castVote = async (walletClient, proposalId, support) => {
  try {
    const wallet = createWallet(walletClient);
    const publicClient = createClient();
    const addresses = getContractAddresses();

    // Cast vote
    const hash = await wallet.writeContract({
      address: addresses.daoGovernance,
      abi: DAOGovernanceABI,
      functionName: 'castVote',
      args: [proposalId, support]
    });

    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  } catch (error) {
    console.error('Error casting vote:', error);
    throw error;
  }
};

/**
 * Execute a proposal
 * @param {object} walletClient - The wallet client
 * @param {number} proposalId - The proposal ID
 * @returns {Promise<string>} - The transaction hash
 */
export const executeProposal = async (walletClient, proposalId) => {
  try {
    const wallet = createWallet(walletClient);
    const publicClient = createClient();
    const addresses = getContractAddresses();

    // Execute proposal
    const hash = await wallet.writeContract({
      address: addresses.daoGovernance,
      abi: DAOGovernanceABI,
      functionName: 'executeProposal',
      args: [proposalId]
    });

    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  } catch (error) {
    console.error('Error executing proposal:', error);
    throw error;
  }
};

/**
 * Cancel a proposal
 * @param {object} walletClient - The wallet client
 * @param {number} proposalId - The proposal ID
 * @returns {Promise<string>} - The transaction hash
 */
export const cancelProposal = async (walletClient, proposalId) => {
  try {
    const wallet = createWallet(walletClient);
    const publicClient = createClient();
    const addresses = getContractAddresses();

    // Cancel proposal
    const hash = await wallet.writeContract({
      address: addresses.daoGovernance,
      abi: DAOGovernanceABI,
      functionName: 'cancelProposal',
      args: [proposalId]
    });

    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  } catch (error) {
    console.error('Error canceling proposal:', error);
    throw error;
  }
};

/**
 * Get proposal state
 * @param {number} proposalId - The proposal ID
 * @returns {Promise<string>} - The proposal state
 */
export const getProposalState = async (proposalId) => {
  try {
    const publicClient = createClient();
    const addresses = getContractAddresses();

    const state = await publicClient.readContract({
      address: addresses.daoGovernance,
      abi: DAOGovernanceABI,
      functionName: 'getProposalState',
      args: [proposalId]
    });

    const stateMap = {
      0: 'Pending',
      1: 'Active',
      2: 'Succeeded',
      3: 'Failed',
      4: 'Executed',
      5: 'Canceled'
    };

    return stateMap[state] || 'Unknown';
  } catch (error) {
    console.error('Error getting proposal state:', error);
    throw error;
  }
};

/**
 * Get proposal summary
 * @param {number} proposalId - The proposal ID
 * @returns {Promise<object>} - The proposal summary
 */
export const getProposalSummary = async (proposalId) => {
  try {
    const publicClient = createClient();
    const addresses = getContractAddresses();

    const summary = await publicClient.readContract({
      address: addresses.daoGovernance,
      abi: DAOGovernanceABI,
      functionName: 'getProposalSummary',
      args: [proposalId]
    });

    return {
      id: summary.id.toString(),
      title: summary.title,
      description: summary.description,
      creator: summary.creator,
      creationTime: new Date(summary.creationTime * 1000).toISOString(),
      endTime: new Date(summary.endTime * 1000).toISOString(),
      votesFor: formatEther(summary.votesFor),
      votesAgainst: formatEther(summary.votesAgainst),
      quorum: formatEther(summary.quorum),
      executed: summary.executed,
      canceled: summary.canceled,
      state: await getProposalState(proposalId)
    };
  } catch (error) {
    console.error('Error getting proposal summary:', error);
    throw error;
  }
};

/**
 * Get all proposals
 * @returns {Promise<Array>} - All proposals
 */
export const getAllProposals = async () => {
  try {
    const publicClient = createClient();
    const addresses = getContractAddresses();

    const proposals = await publicClient.readContract({
      address: addresses.daoGovernance,
      abi: DAOGovernanceABI,
      functionName: 'getAllProposals'
    });

    return Promise.all(proposals.map(async (proposal) => {
      return {
        id: proposal.id.toString(),
        title: proposal.title,
        description: proposal.description,
        creator: proposal.creator,
        creationTime: new Date(proposal.creationTime * 1000).toISOString(),
        endTime: new Date(proposal.endTime * 1000).toISOString(),
        votesFor: formatEther(proposal.votesFor),
        votesAgainst: formatEther(proposal.votesAgainst),
        quorum: formatEther(proposal.quorum),
        executed: proposal.executed,
        canceled: proposal.canceled,
        state: await getProposalState(proposal.id)
      };
    }));
  } catch (error) {
    console.error('Error getting all proposals:', error);
    throw error;
  }
};

/**
 * Get user vote on a proposal
 * @param {number} proposalId - The proposal ID
 * @param {string} voterAddress - The voter address
 * @returns {Promise<object>} - The vote details
 */
export const getUserVote = async (proposalId, voterAddress) => {
  try {
    const publicClient = createClient();
    const addresses = getContractAddresses();

    const [hasVoted, support, votingPower] = await publicClient.readContract({
      address: addresses.daoGovernance,
      abi: DAOGovernanceABI,
      functionName: 'getVote',
      args: [proposalId, voterAddress]
    });

    return {
      hasVoted,
      support,
      votingPower: formatEther(votingPower)
    };
  } catch (error) {
    console.error('Error getting user vote:', error);
    throw error;
  }
};

export default {
  createProposal,
  castVote,
  executeProposal,
  cancelProposal,
  getProposalState,
  getProposalSummary,
  getAllProposals,
  getUserVote
};

