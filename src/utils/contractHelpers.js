import { createPublicClient, http, createWalletClient, parseEther, formatEther } from 'viem';
import { base } from 'viem/chains';

// ABI imports (these would be generated from the compiled contracts)
import TokenFactoryABI from '../abi/TokenFactory.json';
import ERC20TokenABI from '../abi/ERC20Token.json';
import BEP20TokenABI from '../abi/BEP20Token.json';

// Contract addresses (these would be set based on deployment environment)
const CONTRACT_ADDRESSES = {
  development: {
    tokenFactory: '0x...',
  },
  production: {
    tokenFactory: '0x...',
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
 * Deploy a new ERC20 token
 * @param {object} walletClient - The wallet client
 * @param {object} tokenConfig - The token configuration
 * @returns {Promise<string>} - The address of the deployed token
 */
export const deployERC20Token = async (walletClient, tokenConfig) => {
  try {
    const { name, symbol, totalSupply, decimals, mintable, burnable, pausable } = tokenConfig;
    const addresses = getContractAddresses();
    const wallet = createWallet(walletClient);
    const publicClient = createClient();

    // Calculate fee
    const fee = await calculateTokenDeploymentFee(publicClient, { mintable, burnable, pausable });

    // Deploy token
    const hash = await wallet.writeContract({
      address: addresses.tokenFactory,
      abi: TokenFactoryABI,
      functionName: 'createERC20Token',
      args: [name, symbol, decimals, totalSupply, mintable, burnable, pausable],
      value: fee
    });

    // Wait for transaction to be mined
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    // Extract token address from logs
    const event = receipt.logs.find(
      log => log.topics[0] === '0x...' // TokenCreated event signature
    );

    if (!event) {
      throw new Error('Token creation event not found in transaction logs');
    }

    // Parse the event to get the token address
    const tokenAddress = '0x' + event.topics[1].slice(26);
    return tokenAddress;
  } catch (error) {
    console.error('Error deploying ERC20 token:', error);
    throw error;
  }
};

/**
 * Deploy a new BEP20 token
 * @param {object} walletClient - The wallet client
 * @param {object} tokenConfig - The token configuration
 * @returns {Promise<string>} - The address of the deployed token
 */
export const deployBEP20Token = async (walletClient, tokenConfig) => {
  try {
    const { name, symbol, totalSupply, decimals, mintable, burnable, pausable, tokenURI } = tokenConfig;
    const addresses = getContractAddresses();
    const wallet = createWallet(walletClient);
    const publicClient = createClient();

    // Calculate fee
    const fee = await calculateTokenDeploymentFee(publicClient, { mintable, burnable, pausable });

    // Deploy token
    const hash = await wallet.writeContract({
      address: addresses.tokenFactory,
      abi: TokenFactoryABI,
      functionName: 'createBEP20Token',
      args: [name, symbol, decimals, totalSupply, mintable, burnable, pausable, tokenURI || ''],
      value: fee
    });

    // Wait for transaction to be mined
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    // Extract token address from logs
    const event = receipt.logs.find(
      log => log.topics[0] === '0x...' // TokenCreated event signature
    );

    if (!event) {
      throw new Error('Token creation event not found in transaction logs');
    }

    // Parse the event to get the token address
    const tokenAddress = '0x' + event.topics[1].slice(26);
    return tokenAddress;
  } catch (error) {
    console.error('Error deploying BEP20 token:', error);
    throw error;
  }
};

/**
 * Calculate the fee for deploying a token
 * @param {object} publicClient - The public client
 * @param {object} options - The token options
 * @returns {Promise<bigint>} - The fee in wei
 */
export const calculateTokenDeploymentFee = async (publicClient, options) => {
  try {
    const { mintable, burnable, pausable } = options;
    const addresses = getContractAddresses();

    const fee = await publicClient.readContract({
      address: addresses.tokenFactory,
      abi: TokenFactoryABI,
      functionName: 'calculateFee',
      args: [mintable, burnable, pausable]
    });

    return fee;
  } catch (error) {
    console.error('Error calculating token deployment fee:', error);
    throw error;
  }
};

/**
 * Get token details
 * @param {string} tokenAddress - The token address
 * @returns {Promise<object>} - The token details
 */
export const getTokenDetails = async (tokenAddress) => {
  try {
    const publicClient = createClient();

    // Get token details
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      publicClient.readContract({
        address: tokenAddress,
        abi: ERC20TokenABI,
        functionName: 'name'
      }),
      publicClient.readContract({
        address: tokenAddress,
        abi: ERC20TokenABI,
        functionName: 'symbol'
      }),
      publicClient.readContract({
        address: tokenAddress,
        abi: ERC20TokenABI,
        functionName: 'decimals'
      }),
      publicClient.readContract({
        address: tokenAddress,
        abi: ERC20TokenABI,
        functionName: 'totalSupply'
      })
    ]);

    return {
      name,
      symbol,
      decimals,
      totalSupply: formatEther(totalSupply)
    };
  } catch (error) {
    console.error('Error getting token details:', error);
    throw error;
  }
};

/**
 * Get token balance
 * @param {string} tokenAddress - The token address
 * @param {string} accountAddress - The account address
 * @returns {Promise<string>} - The token balance
 */
export const getTokenBalance = async (tokenAddress, accountAddress) => {
  try {
    const publicClient = createClient();

    const balance = await publicClient.readContract({
      address: tokenAddress,
      abi: ERC20TokenABI,
      functionName: 'balanceOf',
      args: [accountAddress]
    });

    return formatEther(balance);
  } catch (error) {
    console.error('Error getting token balance:', error);
    throw error;
  }
};

/**
 * Mint tokens
 * @param {object} walletClient - The wallet client
 * @param {string} tokenAddress - The token address
 * @param {string} to - The recipient address
 * @param {string} amount - The amount to mint
 * @returns {Promise<string>} - The transaction hash
 */
export const mintTokens = async (walletClient, tokenAddress, to, amount) => {
  try {
    const wallet = createWallet(walletClient);
    const publicClient = createClient();

    const hash = await wallet.writeContract({
      address: tokenAddress,
      abi: ERC20TokenABI,
      functionName: 'mint',
      args: [to, parseEther(amount)]
    });

    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  } catch (error) {
    console.error('Error minting tokens:', error);
    throw error;
  }
};

/**
 * Burn tokens
 * @param {object} walletClient - The wallet client
 * @param {string} tokenAddress - The token address
 * @param {string} amount - The amount to burn
 * @returns {Promise<string>} - The transaction hash
 */
export const burnTokens = async (walletClient, tokenAddress, amount) => {
  try {
    const wallet = createWallet(walletClient);
    const publicClient = createClient();

    const hash = await wallet.writeContract({
      address: tokenAddress,
      abi: ERC20TokenABI,
      functionName: 'burn',
      args: [parseEther(amount)]
    });

    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  } catch (error) {
    console.error('Error burning tokens:', error);
    throw error;
  }
};

/**
 * Pause token transfers
 * @param {object} walletClient - The wallet client
 * @param {string} tokenAddress - The token address
 * @returns {Promise<string>} - The transaction hash
 */
export const pauseToken = async (walletClient, tokenAddress) => {
  try {
    const wallet = createWallet(walletClient);
    const publicClient = createClient();

    const hash = await wallet.writeContract({
      address: tokenAddress,
      abi: ERC20TokenABI,
      functionName: 'pause'
    });

    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  } catch (error) {
    console.error('Error pausing token:', error);
    throw error;
  }
};

/**
 * Unpause token transfers
 * @param {object} walletClient - The wallet client
 * @param {string} tokenAddress - The token address
 * @returns {Promise<string>} - The transaction hash
 */
export const unpauseToken = async (walletClient, tokenAddress) => {
  try {
    const wallet = createWallet(walletClient);
    const publicClient = createClient();

    const hash = await wallet.writeContract({
      address: tokenAddress,
      abi: ERC20TokenABI,
      functionName: 'unpause'
    });

    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  } catch (error) {
    console.error('Error unpausing token:', error);
    throw error;
  }
};

/**
 * Transfer tokens
 * @param {object} walletClient - The wallet client
 * @param {string} tokenAddress - The token address
 * @param {string} to - The recipient address
 * @param {string} amount - The amount to transfer
 * @returns {Promise<string>} - The transaction hash
 */
export const transferTokens = async (walletClient, tokenAddress, to, amount) => {
  try {
    const wallet = createWallet(walletClient);
    const publicClient = createClient();

    const hash = await wallet.writeContract({
      address: tokenAddress,
      abi: ERC20TokenABI,
      functionName: 'transfer',
      args: [to, parseEther(amount)]
    });

    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  } catch (error) {
    console.error('Error transferring tokens:', error);
    throw error;
  }
};

export default {
  deployERC20Token,
  deployBEP20Token,
  calculateTokenDeploymentFee,
  getTokenDetails,
  getTokenBalance,
  mintTokens,
  burnTokens,
  pauseToken,
  unpauseToken,
  transferTokens
};

