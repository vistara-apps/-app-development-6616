import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWalletClient, useAccount } from 'wagmi';
import { parseError } from '../utils/errorHandling';
import gatingHelpers from '../utils/gatingHelpers';

// Create context
const GatingContext = createContext();

/**
 * Provider component for token gating-related state and functions
 */
export const GatingProvider = ({ children }) => {
  const { data: walletClient } = useWalletClient();
  const { address: accountAddress, isConnected } = useAccount();
  
  // State
  const [gates, setGates] = useState([]);
  const [userAccess, setUserAccess] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creationStatus, setCreationStatus] = useState({
    isCreating: false,
    createdGate: null,
    gateId: null
  });

  // Load gates when account changes
  useEffect(() => {
    loadGates();
    
    if (isConnected && accountAddress) {
      checkUserAccess();
    } else {
      setUserAccess({});
    }
  }, [accountAddress, isConnected]);

  /**
   * Load all gates
   */
  const loadGates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allGates = await gatingHelpers.getAllGates();
      setGates(allGates);
      
      return allGates;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error loading gates:', parsedError);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check user access to all gates
   */
  const checkUserAccess = async () => {
    try {
      if (!isConnected || !accountAddress) {
        return;
      }
      
      setLoading(true);
      
      const accessMap = {};
      
      for (const gate of gates) {
        const hasAccess = await gatingHelpers.checkAccess(gate.id, accountAddress);
        accessMap[gate.id] = hasAccess;
      }
      
      setUserAccess(accessMap);
      
      return accessMap;
    } catch (err) {
      const parsedError = parseError(err);
      console.error('Error checking user access:', parsedError);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new gate
   * @param {object} gateConfig - Gate configuration
   */
  const createGate = async (gateConfig) => {
    try {
      if (!walletClient || !isConnected) {
        throw new Error('Wallet not connected');
      }

      setCreationStatus({
        isCreating: true,
        createdGate: null,
        gateId: null
      });
      setError(null);

      const gateId = await gatingHelpers.createGate(walletClient, gateConfig);
      
      // Reload gates
      await loadGates();
      
      // Update creation status
      setCreationStatus({
        isCreating: false,
        createdGate: gateConfig,
        gateId
      });

      return gateId;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      setCreationStatus({
        isCreating: false,
        createdGate: null,
        gateId: null
      });
      console.error('Error creating gate:', parsedError);
      throw parsedError;
    }
  };

  /**
   * Update an existing gate
   * @param {number} gateId - Gate ID
   * @param {object} gateConfig - Gate configuration
   */
  const updateGate = async (gateId, gateConfig) => {
    try {
      if (!walletClient || !isConnected) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      const txHash = await gatingHelpers.updateGate(walletClient, gateId, gateConfig);
      
      // Reload gates
      await loadGates();

      return txHash;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error updating gate:', parsedError);
      throw parsedError;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle a gate's active state
   * @param {number} gateId - Gate ID
   */
  const toggleGate = async (gateId) => {
    try {
      if (!walletClient || !isConnected) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      const txHash = await gatingHelpers.toggleGate(walletClient, gateId);
      
      // Reload gates
      await loadGates();

      return txHash;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error toggling gate:', parsedError);
      throw parsedError;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Record access to a gate
   * @param {number} gateId - Gate ID
   */
  const recordAccess = async (gateId) => {
    try {
      if (!walletClient || !isConnected) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      const txHash = await gatingHelpers.recordAccess(walletClient, gateId);
      
      // Reload gates
      await loadGates();

      return txHash;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error recording access:', parsedError);
      throw parsedError;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get content URI for a gate
   * @param {number} gateId - Gate ID
   */
  const getContentURI = async (gateId) => {
    try {
      const contentURI = await gatingHelpers.getContentURI(gateId);
      return contentURI;
    } catch (err) {
      const parsedError = parseError(err);
      console.error('Error getting content URI:', parsedError);
      throw parsedError;
    }
  };

  // Context value
  const value = {
    gates,
    userAccess,
    loading,
    error,
    creationStatus,
    createGate,
    updateGate,
    toggleGate,
    recordAccess,
    getContentURI,
    loadGates,
    checkUserAccess
  };

  return <GatingContext.Provider value={value}>{children}</GatingContext.Provider>;
};

/**
 * Hook to use the gating context
 */
export const useGatingContext = () => {
  const context = useContext(GatingContext);
  if (context === undefined) {
    throw new Error('useGatingContext must be used within a GatingProvider');
  }
  return context;
};

export default GatingContext;

