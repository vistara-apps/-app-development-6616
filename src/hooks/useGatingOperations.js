import { useState, useCallback } from 'react';
import { useGatingContext } from '../context/GatingContext';
import { parseError } from '../utils/errorHandling';

/**
 * Custom hook for token gating operations
 * @returns {object} Gating operations state and functions
 */
export function useGatingOperations() {
  const { 
    gates, 
    userAccess, 
    loading, 
    error: contextError, 
    creationStatus,
    createGate: createGateContext,
    updateGate: updateGateContext,
    toggleGate: toggleGateContext,
    recordAccess: recordAccessContext,
    getContentURI: getContentURIContext,
    loadGates: loadGatesContext,
    checkUserAccess: checkUserAccessContext
  } = useGatingContext();
  
  const [error, setError] = useState(null);
  const [selectedGate, setSelectedGate] = useState(null);
  const [contentURI, setContentURI] = useState(null);

  /**
   * Create a new gate
   * @param {object} gateConfig - Gate configuration
   */
  const createGate = useCallback(async (gateConfig) => {
    try {
      setError(null);
      const result = await createGateContext(gateConfig);
      return result;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error creating gate:', parsedError);
      throw parsedError;
    }
  }, [createGateContext]);

  /**
   * Update a gate
   * @param {number} gateId - Gate ID
   * @param {object} gateConfig - Gate configuration
   */
  const updateGate = useCallback(async (gateId, gateConfig) => {
    try {
      setError(null);
      const result = await updateGateContext(gateId, gateConfig);
      return result;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error updating gate:', parsedError);
      throw parsedError;
    }
  }, [updateGateContext]);

  /**
   * Toggle a gate's active state
   * @param {number} gateId - Gate ID
   */
  const toggleGate = useCallback(async (gateId) => {
    try {
      setError(null);
      const result = await toggleGateContext(gateId);
      return result;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error toggling gate:', parsedError);
      throw parsedError;
    }
  }, [toggleGateContext]);

  /**
   * Record access to a gate
   * @param {number} gateId - Gate ID
   */
  const recordAccess = useCallback(async (gateId) => {
    try {
      setError(null);
      const result = await recordAccessContext(gateId);
      return result;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error recording access:', parsedError);
      throw parsedError;
    }
  }, [recordAccessContext]);

  /**
   * Get content URI for a gate
   * @param {number} gateId - Gate ID
   */
  const getContentURI = useCallback(async (gateId) => {
    try {
      setError(null);
      const uri = await getContentURIContext(gateId);
      setContentURI(uri);
      return uri;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error getting content URI:', parsedError);
      throw parsedError;
    }
  }, [getContentURIContext]);

  /**
   * Load all gates
   */
  const loadGates = useCallback(async () => {
    try {
      setError(null);
      const result = await loadGatesContext();
      return result;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error loading gates:', parsedError);
      throw parsedError;
    }
  }, [loadGatesContext]);

  /**
   * Check user access to all gates
   */
  const checkUserAccess = useCallback(async () => {
    try {
      setError(null);
      const result = await checkUserAccessContext();
      return result;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      console.error('Error checking user access:', parsedError);
      throw parsedError;
    }
  }, [checkUserAccessContext]);

  /**
   * Select a gate
   * @param {object} gate - Gate
   */
  const selectGate = useCallback((gate) => {
    setSelectedGate(gate);
    if (gate) {
      getContentURI(gate.id);
    } else {
      setContentURI(null);
    }
  }, [getContentURI]);

  return {
    gates,
    userAccess,
    loading,
    error: error || contextError,
    creationStatus,
    selectedGate,
    contentURI,
    createGate,
    updateGate,
    toggleGate,
    recordAccess,
    getContentURI,
    loadGates,
    checkUserAccess,
    selectGate
  };
}

export default useGatingOperations;

