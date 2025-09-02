import { useState, useCallback } from 'react';
import { useTokenContext } from '../context/TokenContext';
import { parseError } from '../utils/errorHandling';

/**
 * Custom hook for token operations
 * @returns {object} Token operations state and functions
 */
export function useTokenOperations() {
  const { 
    tokens, 
    loading, 
    error: contextError, 
    deploymentStatus,
    deployToken: deployTokenContext,
    getTokenDetails: getTokenDetailsContext,
    getTokenBalance: getTokenBalanceContext,
    loadUserTokens: loadUserTokensContext
  } = useTokenContext();
  
  const [error, setError] = useState(null);
  const [tokenDetails, setTokenDetails] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);

  /**
   * Deploy a new token
   * @param {object} tokenConfig - Token configuration
   */
  const deployToken = useCallback(async (tokenConfig) => {
    try {
      setError(null);
      const result = await deployTokenContext(tokenConfig);
      return result;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error deploying token:', parsedError);
      throw parsedError;
    }
  }, [deployTokenContext]);

  /**
   * Get token details
   * @param {string} tokenAddress - Token address
   */
  const getTokenDetails = useCallback(async (tokenAddress) => {
    try {
      setError(null);
      const details = await getTokenDetailsContext(tokenAddress);
      setTokenDetails(details);
      return details;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error getting token details:', parsedError);
      throw parsedError;
    }
  }, [getTokenDetailsContext]);

  /**
   * Get token balance
   * @param {string} tokenAddress - Token address
   * @param {string} address - Account address
   */
  const getTokenBalance = useCallback(async (tokenAddress, address) => {
    try {
      setError(null);
      const balance = await getTokenBalanceContext(tokenAddress, address);
      setTokenBalance(balance);
      return balance;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error getting token balance:', parsedError);
      throw parsedError;
    }
  }, [getTokenBalanceContext]);

  /**
   * Load user tokens
   */
  const loadUserTokens = useCallback(async () => {
    try {
      setError(null);
      await loadUserTokensContext();
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error loading user tokens:', parsedError);
      throw parsedError;
    }
  }, [loadUserTokensContext]);

  return {
    tokens,
    loading,
    error: error || contextError,
    deploymentStatus,
    tokenDetails,
    tokenBalance,
    deployToken,
    getTokenDetails,
    getTokenBalance,
    loadUserTokens
  };
}

export default useTokenOperations;

