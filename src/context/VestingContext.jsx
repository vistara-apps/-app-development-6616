import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWalletClient, useAccount } from 'wagmi';
import { parseError } from '../utils/errorHandling';
import vestingHelpers from '../utils/vestingHelpers';

// Create context
const VestingContext = createContext();

/**
 * Provider component for vesting-related state and functions
 */
export const VestingProvider = ({ children }) => {
  const { data: walletClient } = useWalletClient();
  const { address: accountAddress, isConnected } = useAccount();
  
  // State
  const [vestingContracts, setVestingContracts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creationStatus, setCreationStatus] = useState({
    isCreating: false,
    createdSchedule: null,
    txHash: null
  });

  // Load user vesting contracts when account changes
  useEffect(() => {
    if (isConnected && accountAddress) {
      loadUserVestingContracts();
    } else {
      setVestingContracts([]);
      setSchedules([]);
    }
  }, [accountAddress, isConnected]);

  /**
   * Load vesting contracts created by the user
   */
  const loadUserVestingContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // This would be replaced with actual API call or blockchain query
      // to get vesting contracts created by the user
      const userContracts = [
        {
          address: '0x1234567890123456789012345678901234567890',
          tokenAddress: '0x0987654321098765432109876543210987654321',
          tokenName: 'Example Token',
          tokenSymbol: 'EXT',
          createdAt: new Date().toISOString()
        }
      ];
      
      setVestingContracts(userContracts);
      
      // Load schedules for the first contract
      if (userContracts.length > 0) {
        await loadVestingSchedules(userContracts[0].address);
      }
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error loading user vesting contracts:', parsedError);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load vesting schedules for a contract
   * @param {string} contractAddress - Vesting contract address
   */
  const loadVestingSchedules = async (contractAddress) => {
    try {
      setLoading(true);
      setError(null);
      
      const vestingSchedules = await vestingHelpers.getAllVestingSchedules(contractAddress);
      setSchedules(vestingSchedules);
      
      return vestingSchedules;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error loading vesting schedules:', parsedError);
      throw parsedError;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new vesting contract
   * @param {string} tokenAddress - Token address
   */
  const createVestingContract = async (tokenAddress) => {
    try {
      if (!walletClient || !isConnected) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      const contractAddress = await vestingHelpers.createVestingContract(walletClient, tokenAddress);
      
      // Create contract object
      const newContract = {
        address: contractAddress,
        tokenAddress,
        tokenName: 'Token Name', // This would be fetched from the token contract
        tokenSymbol: 'TKN', // This would be fetched from the token contract
        createdAt: new Date().toISOString()
      };

      // Update contracts list
      setVestingContracts(prevContracts => [...prevContracts, newContract]);

      return newContract;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error creating vesting contract:', parsedError);
      throw parsedError;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a vesting schedule
   * @param {string} contractAddress - Vesting contract address
   * @param {object} scheduleConfig - Schedule configuration
   */
  const createSchedule = async (contractAddress, scheduleConfig) => {
    try {
      if (!walletClient || !isConnected) {
        throw new Error('Wallet not connected');
      }

      setCreationStatus({
        isCreating: true,
        createdSchedule: null,
        txHash: null
      });
      setError(null);

      const txHash = await vestingHelpers.createVestingSchedule(
        walletClient,
        contractAddress,
        scheduleConfig
      );

      // Reload schedules
      await loadVestingSchedules(contractAddress);

      // Update creation status
      setCreationStatus({
        isCreating: false,
        createdSchedule: scheduleConfig,
        txHash
      });

      return txHash;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      setCreationStatus({
        isCreating: false,
        createdSchedule: null,
        txHash: null
      });
      console.error('Error creating vesting schedule:', parsedError);
      throw parsedError;
    }
  };

  /**
   * Release vested tokens
   * @param {string} contractAddress - Vesting contract address
   * @param {string} scheduleId - Schedule ID
   */
  const releaseTokens = async (contractAddress, scheduleId) => {
    try {
      if (!walletClient || !isConnected) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      const txHash = await vestingHelpers.releaseVestedTokens(
        walletClient,
        contractAddress,
        scheduleId
      );

      // Reload schedules
      await loadVestingSchedules(contractAddress);

      return txHash;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error releasing vested tokens:', parsedError);
      throw parsedError;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Revoke a vesting schedule
   * @param {string} contractAddress - Vesting contract address
   * @param {string} scheduleId - Schedule ID
   */
  const revokeSchedule = async (contractAddress, scheduleId) => {
    try {
      if (!walletClient || !isConnected) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      const txHash = await vestingHelpers.revokeVestingSchedule(
        walletClient,
        contractAddress,
        scheduleId
      );

      // Reload schedules
      await loadVestingSchedules(contractAddress);

      return txHash;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error revoking vesting schedule:', parsedError);
      throw parsedError;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    vestingContracts,
    schedules,
    loading,
    error,
    creationStatus,
    createVestingContract,
    createSchedule,
    loadVestingSchedules,
    releaseTokens,
    revokeSchedule
  };

  return <VestingContext.Provider value={value}>{children}</VestingContext.Provider>;
};

/**
 * Hook to use the vesting context
 */
export const useVestingContext = () => {
  const context = useContext(VestingContext);
  if (context === undefined) {
    throw new Error('useVestingContext must be used within a VestingProvider');
  }
  return context;
};

export default VestingContext;

