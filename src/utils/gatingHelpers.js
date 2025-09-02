import { createPublicClient, http, createWalletClient, parseEther, formatEther } from 'viem';
import { base } from 'viem/chains';

// ABI imports (these would be generated from the compiled contracts)
import TokenGateABI from '../abi/TokenGate.json';
import ERC20TokenABI from '../abi/ERC20Token.json';

// Contract addresses (these would be set based on deployment environment)
const CONTRACT_ADDRESSES = {
  development: {
    tokenGate: '0x...',
  },
  production: {
    tokenGate: '0x...',
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
 * Create a new gate
 * @param {object} walletClient - The wallet client
 * @param {object} gateConfig - The gate configuration
 * @returns {Promise<number>} - The ID of the created gate
 */
export const createGate = async (walletClient, gateConfig) => {
  try {
    const { name, tokenAddress, minBalance, contentType, contentURI } = gateConfig;
    const wallet = createWallet(walletClient);
    const publicClient = createClient();
    const addresses = getContractAddresses();

    // Create gate
    const hash = await wallet.writeContract({
      address: addresses.tokenGate,
      abi: TokenGateABI,
      functionName: 'createGate',
      args: [
        name,
        tokenAddress,
        parseEther(minBalance),
        contentType,
        contentURI
      ]
    });

    // Wait for transaction to be mined
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    // Extract gate ID from logs
    const event = receipt.logs.find(
      log => log.topics[0] === '0x...' // GateCreated event signature
    );

    if (!event) {
      throw new Error('Gate creation event not found in transaction logs');
    }

    // Parse the event to get the gate ID
    const gateId = parseInt(event.topics[1], 16);
    return gateId;
  } catch (error) {
    console.error('Error creating gate:', error);
    throw error;
  }
};

/**
 * Update an existing gate
 * @param {object} walletClient - The wallet client
 * @param {number} gateId - The gate ID
 * @param {object} gateConfig - The gate configuration
 * @returns {Promise<string>} - The transaction hash
 */
export const updateGate = async (walletClient, gateId, gateConfig) => {
  try {
    const { name, tokenAddress, minBalance, contentType, contentURI, isActive } = gateConfig;
    const wallet = createWallet(walletClient);
    const publicClient = createClient();
    const addresses = getContractAddresses();

    // Update gate
    const hash = await wallet.writeContract({
      address: addresses.tokenGate,
      abi: TokenGateABI,
      functionName: 'updateGate',
      args: [
        gateId,
        name,
        tokenAddress,
        parseEther(minBalance),
        contentType,
        contentURI,
        isActive
      ]
    });

    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  } catch (error) {
    console.error('Error updating gate:', error);
    throw error;
  }
};

/**
 * Toggle a gate's active state
 * @param {object} walletClient - The wallet client
 * @param {number} gateId - The gate ID
 * @returns {Promise<string>} - The transaction hash
 */
export const toggleGate = async (walletClient, gateId) => {
  try {
    const wallet = createWallet(walletClient);
    const publicClient = createClient();
    const addresses = getContractAddresses();

    // Toggle gate
    const hash = await wallet.writeContract({
      address: addresses.tokenGate,
      abi: TokenGateABI,
      functionName: 'toggleGate',
      args: [gateId]
    });

    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  } catch (error) {
    console.error('Error toggling gate:', error);
    throw error;
  }
};

/**
 * Check if a user has access to a gate
 * @param {number} gateId - The gate ID
 * @param {string} userAddress - The user address
 * @returns {Promise<boolean>} - Whether the user has access
 */
export const checkAccess = async (gateId, userAddress) => {
  try {
    const publicClient = createClient();
    const addresses = getContractAddresses();

    const hasAccess = await publicClient.readContract({
      address: addresses.tokenGate,
      abi: TokenGateABI,
      functionName: 'checkAccess',
      args: [gateId, userAddress]
    });

    return hasAccess;
  } catch (error) {
    console.error('Error checking access:', error);
    throw error;
  }
};

/**
 * Record access to a gate
 * @param {object} walletClient - The wallet client
 * @param {number} gateId - The gate ID
 * @returns {Promise<string>} - The transaction hash
 */
export const recordAccess = async (walletClient, gateId) => {
  try {
    const wallet = createWallet(walletClient);
    const publicClient = createClient();
    const addresses = getContractAddresses();

    // Record access
    const hash = await wallet.writeContract({
      address: addresses.tokenGate,
      abi: TokenGateABI,
      functionName: 'recordAccess',
      args: [gateId]
    });

    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  } catch (error) {
    console.error('Error recording access:', error);
    throw error;
  }
};

/**
 * Get content URI for a gate
 * @param {number} gateId - The gate ID
 * @returns {Promise<string>} - The content URI
 */
export const getContentURI = async (gateId) => {
  try {
    const publicClient = createClient();
    const addresses = getContractAddresses();

    const contentURI = await publicClient.readContract({
      address: addresses.tokenGate,
      abi: TokenGateABI,
      functionName: 'getContentURI',
      args: [gateId]
    });

    return contentURI;
  } catch (error) {
    console.error('Error getting content URI:', error);
    throw error;
  }
};

/**
 * Get gate details
 * @param {number} gateId - The gate ID
 * @returns {Promise<object>} - The gate details
 */
export const getGate = async (gateId) => {
  try {
    const publicClient = createClient();
    const addresses = getContractAddresses();

    const gate = await publicClient.readContract({
      address: addresses.tokenGate,
      abi: TokenGateABI,
      functionName: 'getGate',
      args: [gateId]
    });

    return {
      name: gate.name,
      tokenAddress: gate.tokenAddress,
      minBalance: formatEther(gate.minBalance),
      contentType: gate.contentType,
      contentURI: gate.contentURI,
      isActive: gate.isActive,
      accessCount: gate.accessCount.toString()
    };
  } catch (error) {
    console.error('Error getting gate:', error);
    throw error;
  }
};

/**
 * Get all gates
 * @returns {Promise<Array>} - All gates
 */
export const getAllGates = async () => {
  try {
    const publicClient = createClient();
    const addresses = getContractAddresses();

    const gates = await publicClient.readContract({
      address: addresses.tokenGate,
      abi: TokenGateABI,
      functionName: 'getAllGates'
    });

    return gates.map(gate => ({
      name: gate.name,
      tokenAddress: gate.tokenAddress,
      minBalance: formatEther(gate.minBalance),
      contentType: gate.contentType,
      contentURI: gate.contentURI,
      isActive: gate.isActive,
      accessCount: gate.accessCount.toString()
    }));
  } catch (error) {
    console.error('Error getting all gates:', error);
    throw error;
  }
};

export default {
  createGate,
  updateGate,
  toggleGate,
  checkAccess,
  recordAccess,
  getContentURI,
  getGate,
  getAllGates
};

