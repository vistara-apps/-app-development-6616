/**
 * Error handling utilities for TokenSmith application
 */

// Common error types
export const ErrorTypes = {
  WALLET_CONNECTION: 'WALLET_CONNECTION',
  CONTRACT_INTERACTION: 'CONTRACT_INTERACTION',
  TRANSACTION: 'TRANSACTION',
  VALIDATION: 'VALIDATION',
  NETWORK: 'NETWORK',
  UNKNOWN: 'UNKNOWN'
};

/**
 * Parse error message from various sources
 * @param {Error} error - The error object
 * @returns {object} - Parsed error with type and user-friendly message
 */
export const parseError = (error) => {
  // Default error response
  let parsedError = {
    type: ErrorTypes.UNKNOWN,
    message: 'An unknown error occurred. Please try again.',
    originalError: error
  };

  // Check if it's a string
  if (typeof error === 'string') {
    return {
      type: ErrorTypes.UNKNOWN,
      message: error,
      originalError: new Error(error)
    };
  }

  // If not an error object, return default
  if (!error) {
    return parsedError;
  }

  // Extract message from error object
  const errorMessage = error.message || error.reason || JSON.stringify(error);

  // Wallet connection errors
  if (
    errorMessage.includes('wallet') ||
    errorMessage.includes('connect') ||
    errorMessage.includes('account') ||
    errorMessage.includes('user rejected')
  ) {
    parsedError = {
      type: ErrorTypes.WALLET_CONNECTION,
      message: 'Failed to connect to your wallet. Please check your connection and try again.',
      originalError: error
    };
  }
  // Contract interaction errors
  else if (
    errorMessage.includes('contract') ||
    errorMessage.includes('execution reverted') ||
    errorMessage.includes('ABI')
  ) {
    parsedError = {
      type: ErrorTypes.CONTRACT_INTERACTION,
      message: 'There was an issue interacting with the smart contract. Please try again.',
      originalError: error
    };
  }
  // Transaction errors
  else if (
    errorMessage.includes('transaction') ||
    errorMessage.includes('gas') ||
    errorMessage.includes('fee') ||
    errorMessage.includes('underpriced')
  ) {
    parsedError = {
      type: ErrorTypes.TRANSACTION,
      message: 'Transaction failed. This could be due to gas price issues or network congestion.',
      originalError: error
    };
  }
  // Validation errors
  else if (
    errorMessage.includes('invalid') ||
    errorMessage.includes('required') ||
    errorMessage.includes('must be')
  ) {
    parsedError = {
      type: ErrorTypes.VALIDATION,
      message: 'Please check your input values and try again.',
      originalError: error
    };
  }
  // Network errors
  else if (
    errorMessage.includes('network') ||
    errorMessage.includes('chain') ||
    errorMessage.includes('connection')
  ) {
    parsedError = {
      type: ErrorTypes.NETWORK,
      message: 'Network connection issue. Please check your internet connection and wallet network.',
      originalError: error
    };
  }

  return parsedError;
};

/**
 * Handle errors in async functions
 * @param {Function} fn - The async function to execute
 * @param {Function} onError - Error handler function
 * @returns {Function} - Wrapped function with error handling
 */
export const withErrorHandling = (fn, onError) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      const parsedError = parseError(error);
      if (onError) {
        onError(parsedError);
      }
      throw parsedError;
    }
  };
};

/**
 * Format user-friendly error message
 * @param {object} error - The parsed error object
 * @returns {string} - User-friendly error message
 */
export const formatErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // If it's already a string, return it
  if (typeof error === 'string') return error;
  
  // If it's a parsed error object
  if (error.message) return error.message;
  
  // If it's an Error instance
  if (error instanceof Error) return error.message;
  
  // If it's something else, stringify it
  return JSON.stringify(error);
};

/**
 * Get error action based on error type
 * @param {object} error - The parsed error object
 * @returns {object} - Action to take based on error type
 */
export const getErrorAction = (error) => {
  if (!error || !error.type) {
    return {
      actionText: 'Try Again',
      action: () => window.location.reload()
    };
  }

  switch (error.type) {
    case ErrorTypes.WALLET_CONNECTION:
      return {
        actionText: 'Connect Wallet',
        action: () => console.log('Trigger wallet connection')
      };
    case ErrorTypes.NETWORK:
      return {
        actionText: 'Switch Network',
        action: () => console.log('Trigger network switch to Base')
      };
    case ErrorTypes.TRANSACTION:
      return {
        actionText: 'Adjust Gas',
        action: () => console.log('Open gas adjustment dialog')
      };
    default:
      return {
        actionText: 'Try Again',
        action: () => window.location.reload()
      };
  }
};

export default {
  ErrorTypes,
  parseError,
  withErrorHandling,
  formatErrorMessage,
  getErrorAction
};

