import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWalletClient, useAccount } from 'wagmi';
import { parseError } from '../utils/errorHandling';
import daoHelpers from '../utils/daoHelpers';

// Create context
const DAOContext = createContext();

/**
 * Provider component for DAO-related state and functions
 */
export const DAOProvider = ({ children }) => {
  const { data: walletClient } = useWalletClient();
  const { address: accountAddress, isConnected } = useAccount();
  
  // State
  const [proposals, setProposals] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creationStatus, setCreationStatus] = useState({
    isCreating: false,
    createdProposal: null,
    proposalId: null
  });

  // Load proposals when account changes
  useEffect(() => {
    loadProposals();
    
    if (isConnected && accountAddress) {
      loadUserVotes();
    } else {
      setUserVotes({});
    }
  }, [accountAddress, isConnected]);

  /**
   * Load all proposals
   */
  const loadProposals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allProposals = await daoHelpers.getAllProposals();
      setProposals(allProposals);
      
      return allProposals;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error loading proposals:', parsedError);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load user votes for all proposals
   */
  const loadUserVotes = async () => {
    try {
      if (!isConnected || !accountAddress) {
        return;
      }
      
      setLoading(true);
      
      const votesMap = {};
      
      for (const proposal of proposals) {
        const vote = await daoHelpers.getUserVote(proposal.id, accountAddress);
        votesMap[proposal.id] = vote;
      }
      
      setUserVotes(votesMap);
      
      return votesMap;
    } catch (err) {
      const parsedError = parseError(err);
      console.error('Error loading user votes:', parsedError);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new proposal
   * @param {object} proposalConfig - Proposal configuration
   */
  const createProposal = async (proposalConfig) => {
    try {
      if (!walletClient || !isConnected) {
        throw new Error('Wallet not connected');
      }

      setCreationStatus({
        isCreating: true,
        createdProposal: null,
        proposalId: null
      });
      setError(null);

      const proposalId = await daoHelpers.createProposal(walletClient, proposalConfig);
      
      // Reload proposals
      await loadProposals();
      
      // Update creation status
      setCreationStatus({
        isCreating: false,
        createdProposal: proposalConfig,
        proposalId
      });

      return proposalId;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      setCreationStatus({
        isCreating: false,
        createdProposal: null,
        proposalId: null
      });
      console.error('Error creating proposal:', parsedError);
      throw parsedError;
    }
  };

  /**
   * Cast a vote on a proposal
   * @param {number} proposalId - Proposal ID
   * @param {boolean} support - Whether to support the proposal
   */
  const castVote = async (proposalId, support) => {
    try {
      if (!walletClient || !isConnected) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      const txHash = await daoHelpers.castVote(walletClient, proposalId, support);
      
      // Reload proposals and user votes
      await Promise.all([loadProposals(), loadUserVotes()]);

      return txHash;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error casting vote:', parsedError);
      throw parsedError;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Execute a proposal
   * @param {number} proposalId - Proposal ID
   */
  const executeProposal = async (proposalId) => {
    try {
      if (!walletClient || !isConnected) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      const txHash = await daoHelpers.executeProposal(walletClient, proposalId);
      
      // Reload proposals
      await loadProposals();

      return txHash;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error executing proposal:', parsedError);
      throw parsedError;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancel a proposal
   * @param {number} proposalId - Proposal ID
   */
  const cancelProposal = async (proposalId) => {
    try {
      if (!walletClient || !isConnected) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      const txHash = await daoHelpers.cancelProposal(walletClient, proposalId);
      
      // Reload proposals
      await loadProposals();

      return txHash;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error canceling proposal:', parsedError);
      throw parsedError;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get proposal state
   * @param {number} proposalId - Proposal ID
   */
  const getProposalState = async (proposalId) => {
    try {
      const state = await daoHelpers.getProposalState(proposalId);
      return state;
    } catch (err) {
      const parsedError = parseError(err);
      console.error('Error getting proposal state:', parsedError);
      throw parsedError;
    }
  };

  // Context value
  const value = {
    proposals,
    userVotes,
    loading,
    error,
    creationStatus,
    createProposal,
    castVote,
    executeProposal,
    cancelProposal,
    getProposalState,
    loadProposals,
    loadUserVotes
  };

  return <DAOContext.Provider value={value}>{children}</DAOContext.Provider>;
};

/**
 * Hook to use the DAO context
 */
export const useDAOContext = () => {
  const context = useContext(DAOContext);
  if (context === undefined) {
    throw new Error('useDAOContext must be used within a DAOProvider');
  }
  return context;
};

export default DAOContext;

