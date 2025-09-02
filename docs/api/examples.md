# TokenSmith API Examples

This document provides examples of how to use the TokenSmith API for common tasks.

## Table of Contents

1. [Authentication](#authentication)
2. [Token Creation](#token-creation)
3. [Vesting Schedule Management](#vesting-schedule-management)
4. [Token Gating](#token-gating)
5. [DAO Governance](#dao-governance)

## Authentication

Before using the TokenSmith API, you need to authenticate with your wallet. Here's an example of how to do this using JavaScript:

```javascript
// Using ethers.js
const ethers = require('ethers');

async function authenticate() {
  // Connect to the user's wallet
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();
  const address = await signer.getAddress();

  // Get the authentication message from the server
  const response = await fetch('https://api.tokensmith.app/auth/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address }),
  });
  const { message } = await response.json();

  // Sign the message
  const signature = await signer.signMessage(message);

  // Authenticate with the server
  const authResponse = await fetch('https://api.tokensmith.app/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address, signature }),
  });
  const { token } = await authResponse.json();

  // Store the token for future requests
  localStorage.setItem('tokensmith_auth_token', token);

  return token;
}
```

## Token Creation

### Creating an ERC-20 Token

```javascript
async function createERC20Token() {
  const token = localStorage.getItem('tokensmith_auth_token');

  const response = await fetch('https://api.tokensmith.app/api/tokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'My Token',
      symbol: 'MTK',
      totalSupply: '1000000',
      decimals: 18,
      tokenType: 'ERC-20',
      mintable: true,
      burnable: true,
      pausable: false,
    }),
  });

  const result = await response.json();
  console.log('Token created:', result.data);
  return result.data;
}
```

### Minting Tokens

```javascript
async function mintTokens(tokenId, recipient, amount) {
  const token = localStorage.getItem('tokensmith_auth_token');

  const response = await fetch(`https://api.tokensmith.app/api/tokens/${tokenId}/mint`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      recipient,
      amount,
    }),
  });

  const result = await response.json();
  console.log('Tokens minted:', result.data);
  return result.data;
}
```

## Vesting Schedule Management

### Creating a Vesting Contract

```javascript
async function createVestingContract(tokenId) {
  const token = localStorage.getItem('tokensmith_auth_token');

  const response = await fetch('https://api.tokensmith.app/api/vesting/contracts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      tokenId,
    }),
  });

  const result = await response.json();
  console.log('Vesting contract created:', result.data);
  return result.data;
}
```

### Creating a Vesting Schedule

```javascript
async function createVestingSchedule(contractId, beneficiary, amount) {
  const token = localStorage.getItem('tokensmith_auth_token');

  // Calculate dates
  const startDate = new Date();
  const cliffPeriod = 3; // 3 months
  const duration = 12; // 12 months

  const response = await fetch(`https://api.tokensmith.app/api/vesting/contracts/${contractId}/schedules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      beneficiary,
      startDate: startDate.toISOString(),
      cliffPeriod,
      duration,
      amount,
      revocable: true,
    }),
  });

  const result = await response.json();
  console.log('Vesting schedule created:', result.data);
  return result.data;
}
```

### Releasing Vested Tokens

```javascript
async function releaseVestedTokens(scheduleId) {
  const token = localStorage.getItem('tokensmith_auth_token');

  const response = await fetch(`https://api.tokensmith.app/api/vesting/schedules/${scheduleId}/release`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const result = await response.json();
  console.log('Vested tokens released:', result.data);
  return result.data;
}
```

## Token Gating

### Creating a Token Gate

```javascript
async function createTokenGate(tokenId, minBalance, contentURI) {
  const token = localStorage.getItem('tokensmith_auth_token');

  const response = await fetch('https://api.tokensmith.app/api/gating/gates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'Premium Content Access',
      tokenId,
      minBalance,
      contentType: 'webpage',
      contentURI,
    }),
  });

  const result = await response.json();
  console.log('Token gate created:', result.data);
  return result.data;
}
```

### Checking Access to a Gate

```javascript
async function checkGateAccess(gateId) {
  const token = localStorage.getItem('tokensmith_auth_token');

  const response = await fetch(`https://api.tokensmith.app/api/gating/gates/${gateId}/access`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const result = await response.json();
  console.log('Gate access check:', result.data);
  return result.data;
}
```

### Recording Access to a Gate

```javascript
async function recordGateAccess(gateId) {
  const token = localStorage.getItem('tokensmith_auth_token');

  const response = await fetch(`https://api.tokensmith.app/api/gating/gates/${gateId}/access`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const result = await response.json();
  console.log('Gate access recorded:', result.data);
  return result.data;
}
```

## DAO Governance

### Creating a Proposal

```javascript
async function createProposal(title, description, quorum) {
  const token = localStorage.getItem('tokensmith_auth_token');

  const response = await fetch('https://api.tokensmith.app/api/dao/proposals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      description,
      quorum,
    }),
  });

  const result = await response.json();
  console.log('Proposal created:', result.data);
  return result.data;
}
```

### Casting a Vote

```javascript
async function castVote(proposalId, support) {
  const token = localStorage.getItem('tokensmith_auth_token');

  const response = await fetch(`https://api.tokensmith.app/api/dao/proposals/${proposalId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      support,
    }),
  });

  const result = await response.json();
  console.log('Vote cast:', result.data);
  return result.data;
}
```

### Executing a Proposal

```javascript
async function executeProposal(proposalId) {
  const token = localStorage.getItem('tokensmith_auth_token');

  const response = await fetch(`https://api.tokensmith.app/api/dao/proposals/${proposalId}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const result = await response.json();
  console.log('Proposal executed:', result.data);
  return result.data;
}
```

## Complete Example: Token Creation and Vesting

Here's a complete example that creates a token, creates a vesting contract, and sets up a vesting schedule:

```javascript
async function createTokenAndVesting() {
  try {
    // Authenticate
    const authToken = await authenticate();
    
    // Create a token
    const token = await createERC20Token();
    console.log(`Token created at address: ${token.contractAddress}`);
    
    // Create a vesting contract
    const vestingContract = await createVestingContract(token.tokenId);
    console.log(`Vesting contract created at address: ${vestingContract.contractAddress}`);
    
    // Create a vesting schedule
    const beneficiary = '0x1234567890123456789012345678901234567890';
    const amount = '10000';
    const vestingSchedule = await createVestingSchedule(vestingContract.contractId, beneficiary, amount);
    console.log(`Vesting schedule created with ID: ${vestingSchedule.scheduleId}`);
    
    return {
      token,
      vestingContract,
      vestingSchedule
    };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Run the example
createTokenAndVesting()
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Failed:', error));
```

