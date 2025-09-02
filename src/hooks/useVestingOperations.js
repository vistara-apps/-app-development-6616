import { useState, useCallback } from 'react';
import { useVestingContext } from '../context/VestingContext';
import { parseError } from '../utils/errorHandling';

/**
 * Custom hook for vesting operations
 * @returns {object} Vesting operations state and functions
 */
export function useVestingOperations() {
  const { 
    vestingContracts, 
    schedules, 
    loading, 
    error: contextError, 
    creationStatus,
    createVestingContract: createVestingContractContext,
    createSchedule: createScheduleContext,
    loadVestingSchedules: loadVestingSchedulesContext,
    releaseTokens: releaseTokensContext,
    revokeSchedule: revokeScheduleContext
  } = useVestingContext();
  
  const [error, setError] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);

  /**
   * Create a new vesting contract
   * @param {string} tokenAddress - Token address
   */
  const createVestingContract = useCallback(async (tokenAddress) => {
    try {
      setError(null);
      const result = await createVestingContractContext(tokenAddress);
      setSelectedContract(result);
      return result;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error creating vesting contract:', parsedError);
      throw parsedError;
    }
  }, [createVestingContractContext]);

  /**
   * Create a vesting schedule
   * @param {string} contractAddress - Vesting contract address
   * @param {object} scheduleConfig - Schedule configuration
   */
  const createSchedule = useCallback(async (contractAddress, scheduleConfig) => {
    try {
      setError(null);
      const result = await createScheduleContext(contractAddress, scheduleConfig);
      return result;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error creating vesting schedule:', parsedError);
      throw parsedError;
    }
  }, [createScheduleContext]);

  /**
   * Load vesting schedules for a contract
   * @param {string} contractAddress - Vesting contract address
   */
  const loadVestingSchedules = useCallback(async (contractAddress) => {
    try {
      setError(null);
      const result = await loadVestingSchedulesContext(contractAddress);
      return result;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error loading vesting schedules:', parsedError);
      throw parsedError;
    }
  }, [loadVestingSchedulesContext]);

  /**
   * Release vested tokens
   * @param {string} contractAddress - Vesting contract address
   * @param {string} scheduleId - Schedule ID
   */
  const releaseTokens = useCallback(async (contractAddress, scheduleId) => {
    try {
      setError(null);
      const result = await releaseTokensContext(contractAddress, scheduleId);
      return result;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error releasing vested tokens:', parsedError);
      throw parsedError;
    }
  }, [releaseTokensContext]);

  /**
   * Revoke a vesting schedule
   * @param {string} contractAddress - Vesting contract address
   * @param {string} scheduleId - Schedule ID
   */
  const revokeSchedule = useCallback(async (contractAddress, scheduleId) => {
    try {
      setError(null);
      const result = await revokeScheduleContext(contractAddress, scheduleId);
      return result;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error revoking vesting schedule:', parsedError);
      throw parsedError;
    }
  }, [revokeScheduleContext]);

  /**
   * Select a vesting contract
   * @param {object} contract - Vesting contract
   */
  const selectContract = useCallback((contract) => {
    setSelectedContract(contract);
    if (contract) {
      loadVestingSchedules(contract.address);
    }
  }, [loadVestingSchedules]);

  return {
    vestingContracts,
    schedules,
    loading,
    error: error || contextError,
    creationStatus,
    selectedContract,
    createVestingContract,
    createSchedule,
    loadVestingSchedules,
    releaseTokens,
    revokeSchedule,
    selectContract
  };
}

export default useVestingOperations;

