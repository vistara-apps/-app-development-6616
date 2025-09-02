# TokenSmith API Endpoints

This document provides detailed information about the TokenSmith API endpoints, including request/response formats and examples.

## Table of Contents

1. [Tokens](#tokens)
2. [Vesting](#vesting)
3. [Gating](#gating)
4. [DAO](#dao)
5. [Error Handling](#error-handling)

## Tokens

### Create Token

Creates a new token on the Base network.

**Endpoint:** `POST /api/tokens`

**Request Body:**

```json
{
  "name": "My Token",
  "symbol": "MTK",
  "totalSupply": "1000000",
  "decimals": 18,
  "tokenType": "ERC-20",
  "mintable": true,
  "burnable": true,
  "pausable": false
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "tokenId": "123",
    "contractAddress": "0x1234567890123456789012345678901234567890",
    "name": "My Token",
    "symbol": "MTK",
    "totalSupply": "1000000",
    "decimals": 18,
    "tokenType": "ERC-20",
    "mintable": true,
    "burnable": true,
    "pausable": false,
    "createdAt": "2023-01-01T00:00:00Z",
    "txHash": "0x1234567890123456789012345678901234567890123456789012345678901234"
  }
}
```

### Get Token

Gets information about a token.

**Endpoint:** `GET /api/tokens/{tokenId}`

**Response:**

```json
{
  "success": true,
  "data": {
    "tokenId": "123",
    "contractAddress": "0x1234567890123456789012345678901234567890",
    "name": "My Token",
    "symbol": "MTK",
    "totalSupply": "1000000",
    "decimals": 18,
    "tokenType": "ERC-20",
    "mintable": true,
    "burnable": true,
    "pausable": false,
    "createdAt": "2023-01-01T00:00:00Z"
  }
}
```

### List Tokens

Lists all tokens created by the authenticated user.

**Endpoint:** `GET /api/tokens`

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Number of tokens per page (default: 10)

**Response:**

```json
{
  "success": true,
  "data": {
    "tokens": [
      {
        "tokenId": "123",
        "contractAddress": "0x1234567890123456789012345678901234567890",
        "name": "My Token",
        "symbol": "MTK",
        "totalSupply": "1000000",
        "decimals": 18,
        "tokenType": "ERC-20",
        "createdAt": "2023-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalTokens": 1,
      "totalPages": 1
    }
  }
}
```

### Mint Tokens

Mints new tokens for a token contract.

**Endpoint:** `POST /api/tokens/{tokenId}/mint`

**Request Body:**

```json
{
  "recipient": "0x1234567890123456789012345678901234567890",
  "amount": "1000"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "txHash": "0x1234567890123456789012345678901234567890123456789012345678901234"
  }
}
```

### Burn Tokens

Burns tokens from the authenticated user's wallet.

**Endpoint:** `POST /api/tokens/{tokenId}/burn`

**Request Body:**

```json
{
  "amount": "1000"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "txHash": "0x1234567890123456789012345678901234567890123456789012345678901234"
  }
}
```

### Pause Token

Pauses transfers for a token.

**Endpoint:** `POST /api/tokens/{tokenId}/pause`

**Response:**

```json
{
  "success": true,
  "data": {
    "txHash": "0x1234567890123456789012345678901234567890123456789012345678901234"
  }
}
```

### Unpause Token

Unpauses transfers for a token.

**Endpoint:** `POST /api/tokens/{tokenId}/unpause`

**Response:**

```json
{
  "success": true,
  "data": {
    "txHash": "0x1234567890123456789012345678901234567890123456789012345678901234"
  }
}
```

## Vesting

### Create Vesting Contract

Creates a new vesting contract for a token.

**Endpoint:** `POST /api/vesting/contracts`

**Request Body:**

```json
{
  "tokenId": "123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "contractId": "456",
    "contractAddress": "0x1234567890123456789012345678901234567890",
    "tokenId": "123",
    "createdAt": "2023-01-01T00:00:00Z",
    "txHash": "0x1234567890123456789012345678901234567890123456789012345678901234"
  }
}
```

### Get Vesting Contract

Gets information about a vesting contract.

**Endpoint:** `GET /api/vesting/contracts/{contractId}`

**Response:**

```json
{
  "success": true,
  "data": {
    "contractId": "456",
    "contractAddress": "0x1234567890123456789012345678901234567890",
    "tokenId": "123",
    "tokenName": "My Token",
    "tokenSymbol": "MTK",
    "createdAt": "2023-01-01T00:00:00Z"
  }
}
```

### List Vesting Contracts

Lists all vesting contracts created by the authenticated user.

**Endpoint:** `GET /api/vesting/contracts`

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Number of contracts per page (default: 10)

**Response:**

```json
{
  "success": true,
  "data": {
    "contracts": [
      {
        "contractId": "456",
        "contractAddress": "0x1234567890123456789012345678901234567890",
        "tokenId": "123",
        "tokenName": "My Token",
        "tokenSymbol": "MTK",
        "createdAt": "2023-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalContracts": 1,
      "totalPages": 1
    }
  }
}
```

### Create Vesting Schedule

Creates a new vesting schedule for a vesting contract.

**Endpoint:** `POST /api/vesting/contracts/{contractId}/schedules`

**Request Body:**

```json
{
  "beneficiary": "0x1234567890123456789012345678901234567890",
  "startDate": "2023-01-01T00:00:00Z",
  "cliffPeriod": 3,
  "duration": 12,
  "amount": "10000",
  "revocable": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "scheduleId": "789",
    "beneficiary": "0x1234567890123456789012345678901234567890",
    "startDate": "2023-01-01T00:00:00Z",
    "cliffDate": "2023-04-01T00:00:00Z",
    "endDate": "2024-01-01T00:00:00Z",
    "amount": "10000",
    "revocable": true,
    "txHash": "0x1234567890123456789012345678901234567890123456789012345678901234"
  }
}
```

### Get Vesting Schedule

Gets information about a vesting schedule.

**Endpoint:** `GET /api/vesting/schedules/{scheduleId}`

**Response:**

```json
{
  "success": true,
  "data": {
    "scheduleId": "789",
    "contractId": "456",
    "beneficiary": "0x1234567890123456789012345678901234567890",
    "startDate": "2023-01-01T00:00:00Z",
    "cliffDate": "2023-04-01T00:00:00Z",
    "endDate": "2024-01-01T00:00:00Z",
    "totalAmount": "10000",
    "releasedAmount": "2500",
    "vestedAmount": "5000",
    "releasableAmount": "2500",
    "revocable": true,
    "revoked": false
  }
}
```

### List Vesting Schedules

Lists all vesting schedules for a vesting contract.

**Endpoint:** `GET /api/vesting/contracts/{contractId}/schedules`

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Number of schedules per page (default: 10)

**Response:**

```json
{
  "success": true,
  "data": {
    "schedules": [
      {
        "scheduleId": "789",
        "beneficiary": "0x1234567890123456789012345678901234567890",
        "startDate": "2023-01-01T00:00:00Z",
        "cliffDate": "2023-04-01T00:00:00Z",
        "endDate": "2024-01-01T00:00:00Z",
        "totalAmount": "10000",
        "releasedAmount": "2500",
        "revocable": true,
        "revoked": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalSchedules": 1,
      "totalPages": 1
    }
  }
}
```

### Release Vested Tokens

Releases vested tokens for a vesting schedule.

**Endpoint:** `POST /api/vesting/schedules/{scheduleId}/release`

**Response:**

```json
{
  "success": true,
  "data": {
    "releasedAmount": "2500",
    "txHash": "0x1234567890123456789012345678901234567890123456789012345678901234"
  }
}
```

### Revoke Vesting Schedule

Revokes a vesting schedule.

**Endpoint:** `POST /api/vesting/schedules/{scheduleId}/revoke`

**Response:**

```json
{
  "success": true,
  "data": {
    "refundAmount": "5000",
    "txHash": "0x1234567890123456789012345678901234567890123456789012345678901234"
  }
}
```

## Gating

### Create Gate

Creates a new token gate.

**Endpoint:** `POST /api/gating/gates`

**Request Body:**

```json
{
  "name": "Premium Content Access",
  "tokenId": "123",
  "minBalance": "100",
  "contentType": "webpage",
  "contentURI": "https://example.com/premium"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "gateId": "321",
    "name": "Premium Content Access",
    "tokenId": "123",
    "tokenAddress": "0x1234567890123456789012345678901234567890",
    "minBalance": "100",
    "contentType": "webpage",
    "contentURI": "https://example.com/premium",
    "isActive": true,
    "accessCount": 0,
    "txHash": "0x1234567890123456789012345678901234567890123456789012345678901234"
  }
}
```

### Get Gate

Gets information about a token gate.

**Endpoint:** `GET /api/gating/gates/{gateId}`

**Response:**

```json
{
  "success": true,
  "data": {
    "gateId": "321",
    "name": "Premium Content Access",
    "tokenId": "123",
    "tokenAddress": "0x1234567890123456789012345678901234567890",
    "tokenName": "My Token",
    "tokenSymbol": "MTK",
    "minBalance": "100",
    "contentType": "webpage",
    "contentURI": "https://example.com/premium",
    "isActive": true,
    "accessCount": 10
  }
}
```

### List Gates

Lists all token gates created by the authenticated user.

**Endpoint:** `GET /api/gating/gates`

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Number of gates per page (default: 10)

**Response:**

```json
{
  "success": true,
  "data": {
    "gates": [
      {
        "gateId": "321",
        "name": "Premium Content Access",
        "tokenId": "123",
        "tokenName": "My Token",
        "tokenSymbol": "MTK",
        "minBalance": "100",
        "contentType": "webpage",
        "isActive": true,
        "accessCount": 10
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalGates": 1,
      "totalPages": 1
    }
  }
}
```

### Update Gate

Updates a token gate.

**Endpoint:** `PUT /api/gating/gates/{gateId}`

**Request Body:**

```json
{
  "name": "VIP Content Access",
  "minBalance": "200",
  "contentType": "webpage",
  "contentURI": "https://example.com/vip",
  "isActive": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "gateId": "321",
    "name": "VIP Content Access",
    "tokenId": "123",
    "tokenAddress": "0x1234567890123456789012345678901234567890",
    "minBalance": "200",
    "contentType": "webpage",
    "contentURI": "https://example.com/vip",
    "isActive": true,
    "accessCount": 10,
    "txHash": "0x1234567890123456789012345678901234567890123456789012345678901234"
  }
}
```

### Toggle Gate

Toggles the active state of a token gate.

**Endpoint:** `POST /api/gating/gates/{gateId}/toggle`

**Response:**

```json
{
  "success": true,
  "data": {
    "gateId": "321",
    "isActive": false,
    "txHash": "0x1234567890123456789012345678901234567890123456789012345678901234"
  }
}
```

### Check Access

Checks if the authenticated user has access to a token gate.

**Endpoint:** `GET /api/gating/gates/{gateId}/access`

**Response:**

```json
{
  "success": true,
  "data": {
    "hasAccess": true,
    "tokenBalance": "150",
    "minBalance": "100"
  }
}
```

### Record Access

Records access to a token gate.

**Endpoint:** `POST /api/gating/gates/{gateId}/access`

**Response:**

```json
{
  "success": true,
  "data": {
    "gateId": "321",
    "accessCount": 11,
    "txHash": "0x1234567890123456789012345678901234567890123456789012345678901234"
  }
}
```

## DAO

### Create Proposal

Creates a new DAO proposal.

**Endpoint:** `POST /api/dao/proposals`

**Request Body:**

```json
{
  "title": "Increase Marketing Budget",
  "description": "Proposal to increase the marketing budget by 10%.",
  "quorum": "5000"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "proposalId": "654",
    "title": "Increase Marketing Budget",
    "description": "Proposal to increase the marketing budget by 10%.",
    "creator": "0x1234567890123456789012345678901234567890",
    "creationTime": "2023-01-01T00:00:00Z",
    "endTime": "2023-01-08T00:00:00Z",
    "quorum": "5000",
    "txHash": "0x1234567890123456789012345678901234567890123456789012345678901234"
  }
}
```

### Get Proposal

Gets information about a DAO proposal.

**Endpoint:** `GET /api/dao/proposals/{proposalId}`

**Response:**

```json
{
  "success": true,
  "data": {
    "proposalId": "654",
    "title": "Increase Marketing Budget",
    "description": "Proposal to increase the marketing budget by 10%.",
    "creator": "0x1234567890123456789012345678901234567890",
    "creationTime": "2023-01-01T00:00:00Z",
    "endTime": "2023-01-08T00:00:00Z",
    "votesFor": "3000",
    "votesAgainst": "1000",
    "quorum": "5000",
    "executed": false,
    "canceled": false,
    "state": "Active"
  }
}
```

### List Proposals

Lists all DAO proposals.

**Endpoint:** `GET /api/dao/proposals`

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Number of proposals per page (default: 10)
- `state` - Filter by proposal state (optional, one of: "Pending", "Active", "Succeeded", "Failed", "Executed", "Canceled")

**Response:**

```json
{
  "success": true,
  "data": {
    "proposals": [
      {
        "proposalId": "654",
        "title": "Increase Marketing Budget",
        "description": "Proposal to increase the marketing budget by 10%.",
        "creator": "0x1234567890123456789012345678901234567890",
        "creationTime": "2023-01-01T00:00:00Z",
        "endTime": "2023-01-08T00:00:00Z",
        "votesFor": "3000",
        "votesAgainst": "1000",
        "quorum": "5000",
        "state": "Active"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalProposals": 1,
      "totalPages": 1
    }
  }
}
```

### Cast Vote

Casts a vote on a DAO proposal.

**Endpoint:** `POST /api/dao/proposals/{proposalId}/vote`

**Request Body:**

```json
{
  "support": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "proposalId": "654",
    "support": true,
    "votingPower": "1000",
    "txHash": "0x1234567890123456789012345678901234567890123456789012345678901234"
  }
}
```

### Execute Proposal

Executes a DAO proposal.

**Endpoint:** `POST /api/dao/proposals/{proposalId}/execute`

**Response:**

```json
{
  "success": true,
  "data": {
    "proposalId": "654",
    "txHash": "0x1234567890123456789012345678901234567890123456789012345678901234"
  }
}
```

### Cancel Proposal

Cancels a DAO proposal.

**Endpoint:** `POST /api/dao/proposals/{proposalId}/cancel`

**Response:**

```json
{
  "success": true,
  "data": {
    "proposalId": "654",
    "txHash": "0x1234567890123456789012345678901234567890123456789012345678901234"
  }
}
```

### Get User Vote

Gets information about a user's vote on a DAO proposal.

**Endpoint:** `GET /api/dao/proposals/{proposalId}/votes/{address}`

**Response:**

```json
{
  "success": true,
  "data": {
    "hasVoted": true,
    "support": true,
    "votingPower": "1000"
  }
}
```

## Error Handling

The TokenSmith API uses standard HTTP status codes to indicate the success or failure of an API request. In addition, the response body will contain a JSON object with more detailed information about the error.

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request parameters",
    "details": {
      "field": "amount",
      "issue": "Amount must be a positive number"
    }
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` - The request requires authentication
- `FORBIDDEN` - The authenticated user does not have permission to access the requested resource
- `NOT_FOUND` - The requested resource was not found
- `INVALID_REQUEST` - The request parameters are invalid
- `TRANSACTION_FAILED` - The transaction failed to execute on the blockchain
- `INTERNAL_ERROR` - An internal server error occurred

