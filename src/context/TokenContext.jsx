import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWalletClient, useAccount } from 'wagmi';
import { parseError } from '../utils/errorHandling';
import contractHelpers from '../utils/contractHelpers';

// Create context
const TokenContext = createContext();

/**
 * Provider component for token-related state and functions
 */
export const TokenProvider = ({ children }) => {
  const { data: walletClient } = useWalletClient();
  const { address: accountAddress, isConnected } = useAccount();
  
  // State
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deploymentStatus, setDeploymentStatus] = useState({
    isDeploying: false,
    deployedToken: null,
    txHash: null
  });

  // Load user tokens when account changes
  useEffect(() => {
    if (isConnected && accountAddress) {
      loadUserTokens();
    } else {
      setTokens([]);
    }
  }, [accountAddress, isConnected]);

  /**
   * Load tokens created by the user
   */
  const loadUserTokens = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // This would be replaced with actual API call or blockchain query
      // to get tokens created by the user
      const userTokens = [
        {
          address: '0x1234567890123456789012345678901234567890',
          name: 'Example Token',
          symbol: 'EXT',
          decimals: 18,
          totalSupply: '1000000',
          type: 'ERC-20',
          createdAt: new Date().toISOString()
        }
      ];
      
      setTokens(userTokens);
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error loading user tokens:', parsedError);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deploy a new token
   * @param {object} tokenConfig - Token configuration
   */
  const deployToken = async (tokenConfig) => {
    try {
      if (!walletClient || !isConnected) {
        throw new Error('Wallet not connected');
      }

      setDeploymentStatus({
        isDeploying: true,
        deployedToken: null,
        txHash: null
      });
      setError(null);

      // Deploy token based on type
      let tokenAddress;
      if (tokenConfig.tokenType === 'ERC-20') {
        tokenAddress = await contractHelpers.deployERC20Token(walletClient, tokenConfig);
      } else if (tokenConfig.tokenType === 'BEP-20') {
        tokenAddress = await contractHelpers.deployBEP20Token(walletClient, tokenConfig);
      } else {
        throw new Error('Unsupported token type');
      }

      // Get token details
      const tokenDetails = await contractHelpers.getTokenDetails(tokenAddress);

      // Create token object
      const newToken = {
        address: tokenAddress,
        name: tokenDetails.name,
        symbol: tokenDetails.symbol,
        decimals: tokenDetails.decimals,
        totalSupply: tokenDetails.totalSupply,
        type: tokenConfig.tokenType,
        createdAt: new Date().toISOString()
      };

      // Update tokens list
      setTokens(prevTokens => [...prevTokens, newToken]);

      // Update deployment status
      setDeploymentStatus({
        isDeploying: false,
        deployedToken: newToken,
        txHash: tokenAddress // This would be the actual tx hash in a real implementation
      });

      return newToken;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      setDeploymentStatus({
        isDeploying: false,
        deployedToken: null,
        txHash: null
      });
      console.error('Error deploying token:', parsedError);
      throw parsedError;
    }
  };

  /**
   * Get token details
   * @param {string} tokenAddress - Token address
   */
  const getTokenDetails = async (tokenAddress) => {
    try {
      setLoading(true);
      setError(null);
      
      const tokenDetails = await contractHelpers.getTokenDetails(tokenAddress);
      return tokenDetails;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error getting token details:', parsedError);
      throw parsedError;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get token balance
   * @param {string} tokenAddress - Token address
   * @param {string} address - Account address
   */
  const getTokenBalance = async (tokenAddress, address = accountAddress) => {
    try {
      if (!address) {
        throw new Error('Account address is required');
      }
      
      const balance = await contractHelpers.getTokenBalance(tokenAddress, address);
      return balance;
    } catch (err) {
      const parsedError = parseError(err);
      console.error('Error getting token balance:', parsedError);
      throw parsedError;
    }
  };

  // Context value
  const value = {
    tokens,
    loading,
    error,
    deploymentStatus,
    deployToken,
    getTokenDetails,
    getTokenBalance,
    loadUserTokens
  };

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>;
};

/**
 * Hook to use the token context
 */
export const useTokenContext = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokenContext must be used within a TokenProvider');
  }
  return context;
};

export default TokenContext;

