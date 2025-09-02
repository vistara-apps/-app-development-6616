import { createPublicClient, http, createWalletClient, parseEther, formatEther } from 'viem';
import { base } from 'viem/chains';

// ABI imports (these would be generated from the compiled contracts)
import VestingContractABI from '../abi/VestingContract.json';
import ERC20TokenABI from '../abi/ERC20Token.json';

// Contract addresses (these would be set based on deployment environment)
const CONTRACT_ADDRESSES = {
  development: {
    vestingFactory: '0x...',
  },
  production: {
    vestingFactory: '0x...',
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
 * Create a new vesting contract
 * @param {object} walletClient - The wallet client
 * @param {string} tokenAddress - The token address
 * @returns {Promise<string>} - The address of the deployed vesting contract
 */
export const createVestingContract = async (walletClient, tokenAddress) => {
  try {
    const wallet = createWallet(walletClient);
    const publicClient = createClient();
    const addresses = getContractAddresses();

    // Deploy vesting contract
    const hash = await wallet.deployContract({
      abi: VestingContractABI,
      bytecode: '0x...', // Bytecode would be imported from compiled contract
      args: [tokenAddress]
    });

    // Wait for transaction to be mined
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    return receipt.contractAddress;
  } catch (error) {
    console.error('Error creating vesting contract:', error);
    throw error;
  }
};

/**
 * Create a vesting schedule
 * @param {object} walletClient - The wallet client
 * @param {string} vestingContractAddress - The vesting contract address
 * @param {object} scheduleConfig - The schedule configuration
 * @returns {Promise<string>} - The transaction hash
 */
export const createVestingSchedule = async (walletClient, vestingContractAddress, scheduleConfig) => {
  try {
    const { beneficiary, startDate, cliffPeriod, duration, amount, revocable } = scheduleConfig;
    const wallet = createWallet(walletClient);
    const publicClient = createClient();

    // Convert dates to timestamps
    const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
    const cliffDuration = cliffPeriod * 30 * 24 * 60 * 60; // Convert months to seconds
    const durationSeconds = duration * 30 * 24 * 60 * 60; // Convert months to seconds

    // Create vesting schedule
    const hash = await wallet.writeContract({
      address: vestingContractAddress,
      abi: VestingContractABI,
      functionName: 'createVestingSchedule',
      args: [
        beneficiary,
        startTimestamp,
        cliffDuration,
        durationSeconds,
        parseEther(amount),
        revocable
      ]
    });

    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  } catch (error) {
    console.error('Error creating vesting schedule:', error);
    throw error;
  }
};

/**
 * Get vesting schedules for a beneficiary
 * @param {string} vestingContractAddress - The vesting contract address
 * @param {string} beneficiary - The beneficiary address
 * @returns {Promise<Array>} - The vesting schedules
 */
export const getVestingSchedulesForBeneficiary = async (vestingContractAddress, beneficiary) => {
  try {
    const publicClient = createClient();

    // Get vesting schedule IDs for beneficiary
    const scheduleIds = await publicClient.readContract({
      address: vestingContractAddress,
      abi: VestingContractABI,
      functionName: 'getVestingScheduleIdsByBeneficiary',
      args: [beneficiary]
    });

    // Get details for each schedule
    const schedules = await Promise.all(
      scheduleIds.map(async (id) => {
        const schedule = await publicClient.readContract({
          address: vestingContractAddress,
          abi: VestingContractABI,
          functionName: 'getVestingSchedule',
          args: [id]
        });

        const vestedAmount = await publicClient.readContract({
          address: vestingContractAddress,
          abi: VestingContractABI,
          functionName: 'getVestedAmount',
          args: [id]
        });

        const releasableAmount = await publicClient.readContract({
          address: vestingContractAddress,
          abi: VestingContractABI,
          functionName: 'getReleasableAmount',
          args: [id]
        });

        return {
          id,
          beneficiary: schedule.beneficiary,
          start: new Date(schedule.start * 1000).toISOString(),
          cliff: new Date(schedule.cliff * 1000).toISOString(),
          duration: schedule.duration / (30 * 24 * 60 * 60), // Convert seconds to months
          totalAmount: formatEther(schedule.totalAmount),
          releasedAmount: formatEther(schedule.releasedAmount),
          vestedAmount: formatEther(vestedAmount),
          releasableAmount: formatEther(releasableAmount),
          revocable: schedule.revocable,
          revoked: schedule.revoked
        };
      })
    );

    return schedules;
  } catch (error) {
    console.error('Error getting vesting schedules:', error);
    throw error;
  }
};

/**
 * Release vested tokens
 * @param {object} walletClient - The wallet client
 * @param {string} vestingContractAddress - The vesting contract address
 * @param {string} scheduleId - The schedule ID
 * @returns {Promise<string>} - The transaction hash
 */
export const releaseVestedTokens = async (walletClient, vestingContractAddress, scheduleId) => {
  try {
    const wallet = createWallet(walletClient);
    const publicClient = createClient();

    const hash = await wallet.writeContract({
      address: vestingContractAddress,
      abi: VestingContractABI,
      functionName: 'release',
      args: [scheduleId]
    });

    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  } catch (error) {
    console.error('Error releasing vested tokens:', error);
    throw error;
  }
};

/**
 * Revoke a vesting schedule
 * @param {object} walletClient - The wallet client
 * @param {string} vestingContractAddress - The vesting contract address
 * @param {string} scheduleId - The schedule ID
 * @returns {Promise<string>} - The transaction hash
 */
export const revokeVestingSchedule = async (walletClient, vestingContractAddress, scheduleId) => {
  try {
    const wallet = createWallet(walletClient);
    const publicClient = createClient();

    const hash = await wallet.writeContract({
      address: vestingContractAddress,
      abi: VestingContractABI,
      functionName: 'revoke',
      args: [scheduleId]
    });

    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  } catch (error) {
    console.error('Error revoking vesting schedule:', error);
    throw error;
  }
};

/**
 * Get all vesting schedules
 * @param {string} vestingContractAddress - The vesting contract address
 * @returns {Promise<Array>} - The vesting schedules
 */
export const getAllVestingSchedules = async (vestingContractAddress) => {
  try {
    const publicClient = createClient();

    // Get total number of schedules
    const count = await publicClient.readContract({
      address: vestingContractAddress,
      abi: VestingContractABI,
      functionName: 'getVestingSchedulesCount'
    });

    // Get all schedule IDs
    const scheduleIds = [];
    for (let i = 0; i < count; i++) {
      scheduleIds.push(await publicClient.readContract({
        address: vestingContractAddress,
        abi: VestingContractABI,
        functionName: 'vestingScheduleIds',
        args: [i]
      }));
    }

    // Get details for each schedule
    const schedules = await Promise.all(
      scheduleIds.map(async (id) => {
        const schedule = await publicClient.readContract({
          address: vestingContractAddress,
          abi: VestingContractABI,
          functionName: 'getVestingSchedule',
          args: [id]
        });

        return {
          id,
          beneficiary: schedule.beneficiary,
          start: new Date(schedule.start * 1000).toISOString(),
          cliff: new Date(schedule.cliff * 1000).toISOString(),
          duration: schedule.duration / (30 * 24 * 60 * 60), // Convert seconds to months
          totalAmount: formatEther(schedule.totalAmount),
          releasedAmount: formatEther(schedule.releasedAmount),
          revocable: schedule.revocable,
          revoked: schedule.revoked
        };
      })
    );

    return schedules;
  } catch (error) {
    console.error('Error getting all vesting schedules:', error);
    throw error;
  }
};

export default {
  createVestingContract,
  createVestingSchedule,
  getVestingSchedulesForBeneficiary,
  releaseVestedTokens,
  revokeVestingSchedule,
  getAllVestingSchedules
};

