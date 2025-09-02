# TokenSmith API Documentation

This documentation provides comprehensive information about the TokenSmith API, including endpoints, request/response formats, and examples.

## Table of Contents

1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Smart Contract Interfaces](#smart-contract-interfaces)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Examples](#examples)

## Introduction

TokenSmith provides a set of APIs for interacting with the TokenSmith platform, including token creation, vesting schedule management, token gating, and DAO governance. The API is designed to be RESTful and uses JSON for request and response bodies.

## Authentication

TokenSmith uses wallet-based authentication for API access. To authenticate, you need to:

1. Connect your wallet to the TokenSmith platform
2. Sign a message to prove ownership of the wallet
3. Use the resulting authentication token in your API requests

Authentication tokens are valid for 24 hours and must be included in the `Authorization` header of all API requests:

```
Authorization: Bearer <token>
```

## API Endpoints

The TokenSmith API is organized around the following resources:

- [Tokens](./endpoints.md#tokens) - Create and manage tokens
- [Vesting](./endpoints.md#vesting) - Create and manage vesting schedules
- [Gating](./endpoints.md#gating) - Create and manage token gates
- [DAO](./endpoints.md#dao) - Create and manage DAO proposals and votes

For detailed information about each endpoint, including request/response formats and examples, see the [Endpoints](./endpoints.md) documentation.

## Smart Contract Interfaces

TokenSmith provides a set of smart contracts for interacting with the platform. These contracts are deployed on the Base network and can be accessed directly using their ABIs.

For detailed information about each contract, including function signatures and events, see the [Contracts](./contracts.md) documentation.

## Error Handling

The TokenSmith API uses standard HTTP status codes to indicate the success or failure of an API request. In addition, the response body will contain a JSON object with more detailed information about the error.

For more information about error handling, see the [Error Handling](./endpoints.md#error-handling) section in the Endpoints documentation.

## Rate Limiting

The TokenSmith API implements rate limiting to prevent abuse. The rate limits are as follows:

- 100 requests per minute per IP address
- 1000 requests per hour per IP address

If you exceed these limits, you will receive a `429 Too Many Requests` response.

## Examples

For examples of how to use the TokenSmith API, see the [Examples](./examples.md) documentation.

