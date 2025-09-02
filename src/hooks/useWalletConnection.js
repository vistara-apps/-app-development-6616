import { useState, useEffect, useCallback } from 'react';
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { base } from 'wagmi/chains';
import { parseError } from '../utils/errorHandling';

/**
 * Custom hook for wallet connection and network management
 * @returns {object} Wallet connection state and functions
 */
export function useWalletConnection() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors, error: connectError, isLoading: isConnectLoading } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { switchNetwork, isLoading: isSwitchingNetwork, error: switchNetworkError } = useSwitchNetwork();
  
  const [error, setError] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  // Check if connected to the correct network
  useEffect(() => {
    if (isConnected && chain) {
      setIsCorrectNetwork(chain.id === base.id);
    } else {
      setIsCorrectNetwork(false);
    }
  }, [isConnected, chain]);

  // Handle connection errors
  useEffect(() => {
    if (connectError) {
      setError(parseError(connectError));
    } else if (switchNetworkError) {
      setError(parseError(switchNetworkError));
    } else {
      setError(null);
    }
  }, [connectError, switchNetworkError]);

  /**
   * Connect wallet and switch to Base network if needed
   */
  const connectWallet = useCallback(async (connectorId = 'injected') => {
    try {
      setError(null);
      
      // Find the connector by ID
      const connector = connectors.find(c => c.id === connectorId);
      if (!connector) {
        throw new Error(`Connector ${connectorId} not found`);
      }
      
      // Connect wallet
      await connect({ connector });
      
      // Switch to Base network if needed
      if (chain && chain.id !== base.id && switchNetwork) {
        await switchNetwork(base.id);
      }
    } catch (err) {
      setError(parseError(err));
      console.error('Error connecting wallet:', err);
    }
  }, [connect, connectors, chain, switchNetwork]);

  /**
   * Switch to Base network
   */
  const switchToBaseNetwork = useCallback(async () => {
    try {
      setError(null);
      
      if (!switchNetwork) {
        throw new Error('Switch network function not available');
      }
      
      await switchNetwork(base.id);
    } catch (err) {
      setError(parseError(err));
      console.error('Error switching network:', err);
    }
  }, [switchNetwork]);

  /**
   * Disconnect wallet
   */
  const disconnectWallet = useCallback(() => {
    try {
      disconnect();
      setError(null);
    } catch (err) {
      setError(parseError(err));
      console.error('Error disconnecting wallet:', err);
    }
  }, [disconnect]);

  return {
    address,
    isConnected,
    isConnecting: isConnecting || isConnectLoading,
    isSwitchingNetwork,
    isCorrectNetwork,
    chain,
    error,
    connectors,
    connectWallet,
    disconnectWallet,
    switchToBaseNetwork
  };
}

export default useWalletConnection;

