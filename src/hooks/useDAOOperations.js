import { useState, useCallback } from 'react';
import { useDAOContext } from '../context/DAOContext';
import { parseError } from '../utils/errorHandling';

/**
 * Custom hook for DAO operations
 * @returns {object} DAO operations state and functions
 */
export function useDAOOperations() {
  const { 
    proposals, 
    userVotes, 
    loading, 
    error: contextError, 
    creationStatus,
    createProposal: createProposalContext,
    castVote: castVoteContext,
    executeProposal: executeProposalContext,
    cancelProposal: cancelProposalContext,
    getProposalState: getProposalStateContext,
    loadProposals: loadProposalsContext,
    loadUserVotes: loadUserVotesContext
  } = useDAOContext();
  
  const [error, setError] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [proposalState, setProposalState] = useState(null);

  /**
   * Create a new proposal
   * @param {object} proposalConfig - Proposal configuration
   */
  const createProposal = useCallback(async (proposalConfig) => {
    try {
      setError(null);
      const result = await createProposalContext(proposalConfig);
      return result;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error creating proposal:', parsedError);
      throw parsedError;
    }
  }, [createProposalContext]);

  /**
   * Cast a vote on a proposal
   * @param {number} proposalId - Proposal ID
   * @param {boolean} support - Whether to support the proposal
   */
  const castVote = useCallback(async (proposalId, support) => {
    try {
      setError(null);
      const result = await castVoteContext(proposalId, support);
      return result;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error casting vote:', parsedError);
      throw parsedError;
    }
  }, [castVoteContext]);

  /**
   * Execute a proposal
   * @param {number} proposalId - Proposal ID
   */
  const executeProposal = useCallback(async (proposalId) => {
    try {
      setError(null);
      const result = await executeProposalContext(proposalId);
      return result;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error executing proposal:', parsedError);
      throw parsedError;
    }
  }, [executeProposalContext]);

  /**
   * Cancel a proposal
   * @param {number} proposalId - Proposal ID
   */
  const cancelProposal = useCallback(async (proposalId) => {
    try {
      setError(null);
      const result = await cancelProposalContext(proposalId);
      return result;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error canceling proposal:', parsedError);
      throw parsedError;
    }
  }, [cancelProposalContext]);

  /**
   * Get proposal state
   * @param {number} proposalId - Proposal ID
   */
  const getProposalState = useCallback(async (proposalId) => {
    try {
      setError(null);
      const state = await getProposalStateContext(proposalId);
      setProposalState(state);
      return state;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error getting proposal state:', parsedError);
      throw parsedError;
    }
  }, [getProposalStateContext]);

  /**
   * Load all proposals
   */
  const loadProposals = useCallback(async () => {
    try {
      setError(null);
      await loadProposalsContext();
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error loading proposals:', parsedError);
      throw parsedError;
    }
  }, [loadProposalsContext]);

  /**
   * Load user votes
   */
  const loadUserVotes = useCallback(async () => {
    try {
      setError(null);
      await loadUserVotesContext();
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error loading user votes:', parsedError);
      throw parsedError;
    }
  }, [loadUserVotesContext]);

  /**
   * Select a proposal
   * @param {object} proposal - Proposal
   */
  const selectProposal = useCallback((proposal) => {
    setSelectedProposal(proposal);
    if (proposal) {
      getProposalState(proposal.id);
    } else {
      setProposalState(null);
    }
  }, [getProposalState]);

  return {
    proposals,
    userVotes,
    loading,
    error: error || contextError,
    creationStatus,
    selectedProposal,
    proposalState,
    createProposal,
    castVote,
    executeProposal,
    cancelProposal,
    getProposalState,
    loadProposals,
    loadUserVotes,
    selectProposal
  };
}

export default useDAOOperations;

